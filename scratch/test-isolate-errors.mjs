import { chromium } from 'playwright';
const BASE = 'http://localhost:4000';
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({
    viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2.625,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('bw_onboarded', '1');
    localStorage.setItem('bw_cookie_consent', 'accepted');
  });
  const p = await ctx.newPage();
  
  // Track errors per navigation
  let currentPage = 'init';
  const errsByPage = {};
  p.on('pageerror', e => {
    const msg = e.message.substring(0, 200);
    if (!errsByPage[currentPage]) errsByPage[currentPage] = [];
    errsByPage[currentPage].push(msg);
  });

  // Test each page individually
  const pages = ['/', '/techniques', '/exercises', '/workouts', '/workouts/core', '/workouts/goal/punch-harder', '/workout', '/programs'];
  
  for (const path of pages) {
    currentPage = path;
    errsByPage[currentPage] = [];
    console.log(`\n--- Testing ${path} ---`);
    await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(3000);
    console.log(`  URL: ${new URL(p.url()).pathname}`);
    console.log(`  Errors: ${errsByPage[currentPage].length}`);
    errsByPage[currentPage].forEach(e => console.log(`    ⚠️  ${e}`));
  }

  // Test navigation transitions
  console.log('\n--- Navigation transitions ---');
  currentPage = 'nav: / → /techniques';
  errsByPage[currentPage] = [];
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  const cta = p.locator('.hero-cta-primary').first();
  if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cta.tap({ timeout: 3000 });
    await sleep(3000);
    console.log(`  ${currentPage}: ${errsByPage[currentPage].length} errors`);
    errsByPage[currentPage].forEach(e => console.log(`    ⚠️  ${e}`));
  }

  currentPage = 'nav: hamburger → /techniques';
  errsByPage[currentPage] = [];
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  await p.locator('.hamburger').first().tap({ timeout: 3000 });
  await sleep(400);
  const link = p.locator('.nav-links.mobile-open a[href="/techniques"]').first();
  if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
    await link.tap({ timeout: 3000 });
    await sleep(3000);
    console.log(`  ${currentPage}: ${errsByPage[currentPage].length} errors`);
    errsByPage[currentPage].forEach(e => console.log(`    ⚠️  ${e}`));
  }

  // Summary
  console.log('\n=== ERROR SUMMARY ===');
  let totalRC = 0;
  for (const [page, errs] of Object.entries(errsByPage)) {
    const rc = errs.filter(e => e.includes('removeChild') || e.includes('insertBefore')).length;
    if (rc > 0) {
      console.log(`🔴 ${page}: ${rc} removeChild errors`);
      totalRC += rc;
    }
  }
  if (totalRC === 0) console.log('🟢 No removeChild errors on any page');
  else console.log(`\nTotal removeChild errors: ${totalRC}`);
  
  await b.close();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
