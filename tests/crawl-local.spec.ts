import { test, expect } from '@playwright/test';

test.describe('Crawl local site and check for errors', () => {
  const BASE_URL = 'http://localhost:3000';
  const visited = new Set<string>();
  const queue = ['/'];
  const maxPages = 40;

  test('crawl local server and detect runtime errors, bad requests, or broken pages', async ({ page }) => {
    test.setTimeout(120000);
    // Track errors and warnings
    const consoleErrors: string[] = [];
    const uncaughtExceptions: Error[] = [];
    const failedRequests: { url: string; status: number }[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()} at ${page.url()}`);
      }
    });

    page.on('pageerror', err => {
      uncaughtExceptions.push(err);
    });

    page.on('requestfailed', request => {
      const url = request.url();
      if (!url.startsWith(BASE_URL)) {
        return;
      }
      const failure = request.failure();
      if (failure?.errorText === 'net::ERR_ABORTED' || failure?.errorText?.includes('aborted')) {
        return;
      }
      failedRequests.push({
        url,
        status: 0, // Request failed completely (e.g. network error)
      });
    });

    page.on('response', response => {
      const status = response.status();
      const url = response.url();
      // Only care about local app resources, ignore external tracker/analytics requests if any
      if (url.startsWith(BASE_URL) && status >= 400) {
        failedRequests.push({ url, status });
      }
    });

    let pagesCrawled = 0;

    while (queue.length > 0 && pagesCrawled < maxPages) {
      const currentPath = queue.shift()!;
      const fullUrl = `${BASE_URL}${currentPath}`;

      if (visited.has(fullUrl)) continue;
      visited.add(fullUrl);
      pagesCrawled++;

      console.log(`Crawling (${pagesCrawled}): ${fullUrl}`);

      try {
        const response = await page.goto(fullUrl, { waitUntil: 'load', timeout: 10000 });
        if (!response) {
          console.error(`No response for ${fullUrl}`);
          continue;
        }

        const status = response.status();
        expect(status).toBeLessThan(400);

        // Check if there is any clerk redirect to sign-in or similar that we should note
        const currentUrl = page.url();

        // Parse links if we are still within BASE_URL
        if (currentUrl.startsWith(BASE_URL)) {
          const links = await page.locator('a').evaluateAll((anchors: HTMLAnchorElement[]) => {
            return anchors
              .map(a => a.getAttribute('href'))
              .filter((href): href is string => !!href && (href.startsWith('/') || href.startsWith('http://localhost:3000')));
          });

          for (const link of links) {
            let path = link;
            if (path.startsWith(BASE_URL)) {
              path = path.slice(BASE_URL.length);
            }
            // Normalize path (strip query params, hash)
            const cleanPath = path.split('?')[0].split('#')[0];
            if (cleanPath && !visited.has(`${BASE_URL}${cleanPath}`) && !queue.includes(cleanPath)) {
              // Avoid duplicate dynamic routes if we already have too many
              if (cleanPath.startsWith('/food/') && queue.filter(q => q.startsWith('/food/')).length > 2) continue;
              if (cleanPath.startsWith('/recipe/') && queue.filter(q => q.startsWith('/recipe/')).length > 2) continue;
              if (cleanPath.startsWith('/foods/') && queue.filter(q => q.startsWith('/foods/')).length > 2) continue;
              if (cleanPath.startsWith('/athlete/') && queue.filter(q => q.startsWith('/athlete/')).length > 2) continue;
              if (cleanPath.startsWith('/athletes/') && queue.filter(q => q.startsWith('/athletes/')).length > 2) continue;

              queue.push(cleanPath);
            }
          }
        }
      } catch (err) {
        console.error(`Failed to load ${fullUrl}:`, err);
      }
    }

    // Verify no page errors or exceptions
    console.log(`Crawled ${pagesCrawled} pages.`);
    if (uncaughtExceptions.length > 0) {
      console.error('Uncaught exceptions found:');
      uncaughtExceptions.forEach(err => console.error(err));
    }
    if (consoleErrors.length > 0) {
      console.error('Console errors found:');
      consoleErrors.forEach(err => console.error(err));
    }
    if (failedRequests.length > 0) {
      console.error('Failed network requests found:');
      failedRequests.forEach(req => console.error(`${req.url} returned status ${req.status}`));
    }

    expect(uncaughtExceptions.length).toBe(0);
    expect(failedRequests.length).toBe(0);
  });
});
