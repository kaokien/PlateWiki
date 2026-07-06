import { chromium } from 'playwright';
const BASE = 'https://boxingwiki-kaokiens-projects.vercel.app';
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
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.substring(0, 120)));

  // Navigate to the preview URL
  console.log('Loading preview URL...');
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);
  
  const url = p.url();
  const status = await p.evaluate(() => document.title);
  console.log('Current URL:', url);
  console.log('Title:', status);
  console.log('Page HTML length:', await p.evaluate(() => document.documentElement.innerHTML.length));
  
  // Check if we got redirected to Clerk sign-in
  if (url.includes('clerk') || url.includes('sign-in')) {
    console.log('⚠️  Preview URL requires Clerk auth — cannot test without credentials');
    console.log('Checking if page at least loaded without JS errors...');
  }
  
  // Try to set onboarding/consent in localStorage and reload
  await p.evaluate(() => {
    try {
      localStorage.setItem('bw_onboarded', '1');
      localStorage.setItem('bw_cookie_consent', 'accepted');
    } catch(e) {}
  });
  await p.reload({ waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  
  const url2 = p.url();
  console.log('After reload URL:', url2);
  
  // Check if we can see content
  const hasHero = await p.locator('.hero-cta-primary').isVisible({ timeout: 3000 }).catch(() => false);
  const hasHamburger = await p.locator('.hamburger').isVisible({ timeout: 3000 }).catch(() => false);
  
  console.log('Has hero CTA:', hasHero);
  console.log('Has hamburger:', hasHamburger);
  
  if (hasHero) {
    // Test single-tap hero CTA
    await p.locator('.hero-cta-primary').first().tap({ timeout: 3000 });
    try {
      await p.waitForURL(u => new URL(u).pathname === '/techniques', { timeout: 6000 });
      ok('Hero CTA → /techniques (single tap)');
    } catch { bad('Hero CTA', `stuck at ${p.url()}`); }
  } else {
    console.log('Cannot test clicks — page not accessible');
  }
  
  if (hasHamburger) {
    await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(2000);
    await p.locator('.hamburger').first().tap({ timeout: 3000 });
    await sleep(400);
    const menuOpen = await p.locator('.nav-links.mobile-open').isVisible({ timeout: 2000 }).catch(() => false);
    if (menuOpen) {
      ok('Hamburger opens on SINGLE tap');
    } else {
      bad('Hamburger', 'menu did NOT open on single tap');
    }
  }
  
  // Results
  console.log(`\n=== RESULTS: ${pass} passed, ${fail} failed ===`);
  console.log(`Total JS errors: ${errs.length}`);
  errs.forEach(e => console.log(`  ⚠️  ${e}`));
  const rcErrs = errs.filter(e => e.includes('removeChild') || e.includes('insertBefore'));
  console.log(`removeChild errors: ${rcErrs.length}`);
  
  if (rcErrs.length > 0) {
    console.log('\n🔴 REMOVECHILD ERRORS FOUND — BUG IS BACK');
    process.exitCode = 1;
  } else if (fail > 0) {
    console.log('\n🟡 SOME TESTS FAILED');
    process.exitCode = 1;
  } else if (pass > 0) {
    console.log('\n🟢 ALL TESTS PASS');
  } else {
    console.log('\n⚠️  NO TESTS RAN — preview might need auth');
  }
  
  await b.close();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
