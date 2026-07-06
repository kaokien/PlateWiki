/**
 * Playwright test — /fighter page mobile layout + customization
 * 
 * Tests run against the live site (boxingwiki.org) which has auth state
 * via Clerk. Since we can't easily mock auth, tests that require 
 * signed-in state are marked with `.skip` and can be run manually
 * when signed in via browser context.
 * 
 * Run: npx playwright test tests/fighter-mobile.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE = 'https://boxingwiki.org';
const MOBILE = { width: 390, height: 844 };

test.describe('Fighter Page — Mobile Layout', () => {
  test.use({ viewport: MOBILE });

  test('page loads and shows content or auth gate', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    // Either the fighter hero or auth gate should be visible
    const heroOrGate = page.locator('.fighter-hero, .auth-gate');
    await expect(heroOrGate.first()).toBeVisible({ timeout: 15000 });

    await page.screenshot({
      path: 'tests/screenshots/fighter-mobile-load.png',
      fullPage: true,
    });
  });

  test('hero badge not clipped by overflow — CSS check', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    // Check that fighter-hero doesn't have overflow: hidden
    const hero = page.locator('.fighter-hero');
    if (await hero.count() > 0) {
      const overflow = await hero.evaluate(el => getComputedStyle(el).overflow);
      expect(overflow).not.toBe('hidden');

      // Badge should exist and be visible
      const badge = page.locator('.fighter-hero__stage-badge');
      if (await badge.count() > 0) {
        await expect(badge).toBeVisible();

        // Badge z-index should be >= 2
        const zIndex = await badge.evaluate(el => getComputedStyle(el).zIndex);
        expect(parseInt(zIndex) || 0).toBeGreaterThanOrEqual(2);

        // Badge must be fully inside hero bounds
        const heroBox = await hero.boundingBox();
        const badgeBox = await badge.boundingBox();
        if (heroBox && badgeBox) {
          expect(badgeBox.y + badgeBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height + 2);
          expect(badgeBox.y).toBeGreaterThanOrEqual(heroBox.y - 2);
        }
      }
    }
  });

  test('pixel fighter scales down on mobile viewport', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    const fighter = page.locator('.fighter-hero .pixel-fighter--xl');
    if (await fighter.count() > 0) {
      const box = await fighter.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // Should be scaled to ~160px on mobile (390px viewport)
        expect(box.width).toBeLessThanOrEqual(200);
        expect(box.width).toBeGreaterThanOrEqual(100);
      }
    }
  });

  test('customizer panel exists and collapses/expands', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    const toggle = page.locator('.fighter-customizer__toggle');
    if (await toggle.count() === 0) {
      test.skip(true, 'Customizer not visible (auth required)');
      return;
    }

    await expect(toggle).toBeVisible();

    // Initially collapsed — body hidden
    const body = page.locator('.fighter-customizer__body');
    await expect(body).not.toBeVisible();

    // Preview dots visible when collapsed
    const dots = page.locator('.fighter-customizer__preview-dot');
    expect(await dots.count()).toBe(4);

    // Expand
    await toggle.click();
    await expect(body).toBeVisible({ timeout: 3000 });

    // 4 color rows
    const rows = page.locator('.customizer-row');
    expect(await rows.count()).toBe(4);

    // Chevron rotated
    const chevron = page.locator('.fighter-customizer__chevron');
    await expect(chevron).toHaveClass(/fighter-customizer__chevron--open/);

    await page.screenshot({
      path: 'tests/screenshots/fighter-mobile-customizer-open.png',
      fullPage: false,
    });

    // Collapse
    await toggle.click();
    await expect(body).not.toBeVisible();
  });

  test('color swatch selection persists to localStorage', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    const toggle = page.locator('.fighter-customizer__toggle');
    if (await toggle.count() === 0) {
      test.skip(true, 'Customizer not visible (auth required)');
      return;
    }

    // Open customizer
    await toggle.click();
    await expect(page.locator('.fighter-customizer__body')).toBeVisible();

    // Click the 4th skin swatch (index 3 = Medium Dark)
    const skinSwatches = page.locator('.customizer-row').first().locator('.customizer-swatch');
    await skinSwatches.nth(3).click();
    await expect(skinSwatches.nth(3)).toHaveClass(/customizer-swatch--active/);

    // Verify localStorage 
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('boxingwiki_fighter_customization');
      return raw ? JSON.parse(raw) : null;
    });
    expect(stored).not.toBeNull();
    expect(stored.skinTone).toBe(3);
  });

  test('swatch touch targets meet minimum size', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });

    const toggle = page.locator('.fighter-customizer__toggle');
    if (await toggle.count() === 0) {
      test.skip(true, 'Customizer not visible (auth required)');
      return;
    }

    await toggle.click();
    await expect(page.locator('.fighter-customizer__body')).toBeVisible();

    const swatch = page.locator('.customizer-swatch').first();
    const box = await swatch.boundingBox();
    expect(box).not.toBeNull();
    // Min 28px on mobile per our CSS
    expect(box!.width).toBeGreaterThanOrEqual(26);
    expect(box!.height).toBeGreaterThanOrEqual(26);
  });

  test('full page screenshot for visual review', async ({ page }) => {
    await page.goto(`${BASE}/fighter`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'tests/screenshots/fighter-mobile-full.png',
      fullPage: true,
    });
  });
});
