import { chromium } from 'playwright';
const BASE = 'https://boxingwiki.org';
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
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.substring(0, 200)));

  // Load home page
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);
  console.log('Home loaded. Errors so far:', errs.length);

  // Navigate via CTA
  const cta = p.locator('.hero-cta-primary').first();
  if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cta.tap({ timeout: 3000 });
    await sleep(3000);
    console.log('After CTA nav. Total errors:', errs.length);
  }

  // Check for removeChild
  const rcErrs = errs.filter(e => e.includes('removeChild') || e.includes('insertBefore'));
  console.log('\n=== PRODUCTION (rollback) TEST ===');
  console.log('Total JS errors:', errs.length);
  errs.forEach(e => console.log('  ' + e));
  console.log('removeChild errors:', rcErrs.length);
  
  if (rcErrs.length > 0) {
    console.log('📌 Production ALSO has removeChild errors');
  } else {
    console.log('✅ Production has NO removeChild errors');
  }

  await b.close();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
