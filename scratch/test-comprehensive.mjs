import { chromium } from 'playwright';
const BASE = 'https://boxingwiki.org';
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
let pass = 0, fail = 0;

function ok(name) { console.log(`✅ ${name}`); pass++; }
function bad(name, detail) { console.log(`❌ ${name}: ${detail}`); fail++; }

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
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.substring(0, 120)));

  // --- Test 1: Home page loads ---
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);
  ok('Home page loads');

  // --- Test 2: Hero CTA ---
  const cta = p.locator('.hero-cta-primary').first();
  if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cta.tap({ timeout: 3000 });
    try {
      await p.waitForURL(u => new URL(u).pathname === '/techniques', { timeout: 6000 });
      ok('Hero CTA → /techniques');
    } catch { bad('Hero CTA', `stuck at ${new URL(p.url()).pathname}`); }
  } else { bad('Hero CTA', 'not visible'); }

  // --- Test 3: Navigate to exercises page ---
  await p.goto(`${BASE}/exercises`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  const exTitle = await p.title();
  if (exTitle.includes('Exercise') || exTitle.includes('BoxingWiki')) {
    ok('Exercises page loads');
  } else { bad('Exercises page', `title: ${exTitle}`); }

  // --- Test 4: Navigate to workouts page ---
  await p.goto(`${BASE}/workouts`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  const wkTitle = await p.title();
  if (wkTitle.includes('Workout') || wkTitle.includes('BoxingWiki')) {
    ok('Workouts page loads');
  } else { bad('Workouts page', `title: ${wkTitle}`); }

  // --- Test 5: Navigate to a specific workout ---
  await p.goto(`${BASE}/workouts/core`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  if (new URL(p.url()).pathname.includes('/workouts/core')) {
    ok('Core workout page loads');
  } else { bad('Core workout', `at ${new URL(p.url()).pathname}`); }

  // --- Test 6: Navigate to goal workout ---
  await p.goto(`${BASE}/workouts/goal/punch-harder`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  if (new URL(p.url()).pathname.includes('/workouts/goal/punch-harder')) {
    ok('Goal workout page loads');
  } else { bad('Goal workout', `at ${new URL(p.url()).pathname}`); }

  // --- Test 7: Hamburger → single tap nav ---
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  await p.locator('.hamburger').first().tap({ timeout: 3000 });
  await sleep(400);
  const mo = await p.locator('.nav-links.mobile-open').isVisible({ timeout: 2000 }).catch(() => false);
  if (mo) {
    ok('Hamburger opens on first tap');
    // Navigate from hamburger
    const techLink = p.locator('.nav-links.mobile-open a[href="/techniques"]').first();
    if (await techLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await techLink.tap({ timeout: 3000 });
      try {
        await p.waitForURL(u => new URL(u).pathname === '/techniques', { timeout: 6000 });
        ok('Hamburger nav → /techniques');
      } catch { bad('Hamburger nav', `stuck at ${new URL(p.url()).pathname}`); }
    }
  } else { bad('Hamburger', 'menu did not open'); }

  // --- Test 8: Logo nav ---
  await sleep(2000);
  const logo = p.locator('.logo').first();
  if (await logo.isVisible({ timeout: 3000 }).catch(() => false)) {
    await logo.tap({ timeout: 3000 });
    try {
      await p.waitForURL(u => new URL(u).pathname === '/', { timeout: 6000 });
      ok('Logo → /');
    } catch { bad('Logo', `stuck at ${new URL(p.url()).pathname}`); }
  }

  // --- Results ---
  console.log(`\n=== RESULTS: ${pass} passed, ${fail} failed ===`);
  console.log(`Total JS errors: ${errs.length}`);
  const rcErrs = errs.filter(e => e.includes('removeChild') || e.includes('insertBefore'));
  console.log(`removeChild errors: ${rcErrs.length}`);
  rcErrs.forEach(e => console.log(`  ❌ ${e}`));
  
  if (fail > 0 || rcErrs.length > 0) {
    console.log('\n🔴 VERIFICATION FAILED');
    process.exitCode = 1;
  } else {
    console.log('\n🟢 ALL TESTS PASS');
  }

  await b.close();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
