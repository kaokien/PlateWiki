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

  // Test 1: Home page loads
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);
  ok('Home page loads');

  // Test 2: Hero CTA single-tap
  const cta = p.locator('.hero-cta-primary').first();
  if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cta.tap({ timeout: 3000 });
    try {
      await p.waitForURL(u => new URL(u).pathname === '/techniques', { timeout: 6000 });
      ok('Hero CTA → /techniques (single tap)');
    } catch { bad('Hero CTA', `stuck at ${new URL(p.url()).pathname}`); }
  } else { bad('Hero CTA', 'not visible'); }

  // Test 3: Hamburger single-tap
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  const ham = p.locator('.hamburger').first();
  await ham.tap({ timeout: 3000 });
  await sleep(400);
  const menuOpen = await p.locator('.nav-links.mobile-open').isVisible({ timeout: 2000 }).catch(() => false);
  if (menuOpen) {
    ok('Hamburger opens on SINGLE tap');
    const techLink = p.locator('.nav-links.mobile-open a[href="/techniques"]').first();
    if (await techLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await techLink.tap({ timeout: 3000 });
      try {
        await p.waitForURL(u => new URL(u).pathname === '/techniques', { timeout: 6000 });
        ok('Hamburger nav → /techniques (single tap)');
      } catch { bad('Hamburger nav', `stuck at ${new URL(p.url()).pathname}`); }
    }
  } else { bad('Hamburger', 'menu did NOT open on single tap'); }

  // Test 4: Logo single-tap
  await sleep(1000);
  const logo = p.locator('.logo').first();
  if (await logo.isVisible({ timeout: 3000 }).catch(() => false)) {
    await logo.tap({ timeout: 3000 });
    try {
      await p.waitForURL(u => new URL(u).pathname === '/', { timeout: 6000 });
      ok('Logo → / (single tap)');
    } catch { bad('Logo', `stuck at ${new URL(p.url()).pathname}`); }
  }

  // Test 5-8: New pages load
  for (const [path, name] of [
    ['/exercises', 'Exercises'],
    ['/workouts', 'Workouts'],
    ['/workouts/core', 'Core workout'],
    ['/workouts/goal/punch-harder', 'Goal workout']
  ]) {
    await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);
    if (new URL(p.url()).pathname.includes(path)) {
      ok(`${name} page loads`);
    } else { bad(name, `redirected to ${new URL(p.url()).pathname}`); }
  }

  // Results
  console.log(`\n=== RESULTS: ${pass} passed, ${fail} failed ===`);
  console.log(`Total JS errors: ${errs.length}`);
  const rcErrs = errs.filter(e => e.includes('removeChild') || e.includes('insertBefore'));
  console.log(`removeChild errors: ${rcErrs.length}`);
  rcErrs.forEach(e => console.log(`  ❌ ${e}`));
  
  if (fail > 0 || rcErrs.length > 0) {
    console.log('\n🔴 VERIFICATION FAILED');
    process.exitCode = 1;
  } else {
    console.log('\n🟢 ALL TESTS PASS — NO DOUBLE-CLICK BUG');
  }

  await b.close();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
