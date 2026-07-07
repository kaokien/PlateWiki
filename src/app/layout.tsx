import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, Lora, Caveat } from 'next/font/google';
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';
import Providers from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import CookieConsent from '@/components/CookieConsent';
import UpgradeNudge from '@/components/UpgradeNudge';
import DevToolbar from '@/components/DevToolbar';
import BackNavCleanup from '@/components/BackNavDetector';
import { JsonLd } from '@/components/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '@/utils/seoSchemas';
import { GA_MEASUREMENT_ID } from '@/utils/analytics';
import { TECHNIQUE_COUNT } from '@/data/techniqueCount';
import './globals.css';
import './layout.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-handwriting',
});

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: {
    default: 'PlateWiki — Organic Nutrition & Fueling for Athletes',
    template: '%s | PlateWiki',
  },
  description:
    `Free interactive nutrition encyclopedia with ${TECHNIQUE_COUNT}+ foods, dietary guides, and fueling programs. Ideal for fighters, runners, and weightlifters.`,
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'PlateWiki',
    title: 'PlateWiki — Organic Nutrition & Fueling for Athletes',
    description:
      `Free interactive food and nutrition encyclopedia for athletes. Learn pre-workout, post-workout, and gut-health fueling.`,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlateWiki — Organic Nutrition & Fueling for Athletes',
    description:
      `Free interactive food and nutrition encyclopedia. ${TECHNIQUE_COUNT}+ foods with step-by-step prep and fueling breakdowns.`,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f1ea' },
    { media: '(prefers-color-scheme: dark)', color: '#141a16' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Clerk frontend origin, derived from the publishable key (the key's suffix
 * is the base64-encoded frontend API host). Keeps the preconnect hint
 * correct automatically when switching between dev and production Clerk
 * instances.
 */
function clerkFrontendOrigin(): string {
  const fallback = 'https://divine-vervet-27.clerk.accounts.dev';
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  const match = pk.match(/^pk_(?:test|live)_(.+)$/);
  if (!match) return fallback;
  try {
    const host = Buffer.from(match[1], 'base64').toString('utf8').replace(/\$$/, '');
    return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : fallback;
  } catch {
    return fallback;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const siteSchema = getWebSiteSchema();
  const clerkOrigin = clerkFrontendOrigin();

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href={clerkOrigin} />
        <link rel="preconnect" href={clerkOrigin} crossOrigin="anonymous" />
        {/* Google Consent Mode v2 Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              
              var initialConsent = 'denied';
              try {
                var consentVal = localStorage.getItem('bw_cookie_consent');
                if (consentVal === 'accepted') {
                  initialConsent = 'granted';
                }
              } catch (e) {}

              gtag('consent', 'default', {
                'ad_storage': initialConsent,
                'ad_user_data': initialConsent,
                'ad_personalization': initialConsent,
                'analytics_storage': initialConsent
              });
              
              if (initialConsent === 'denied') {
                window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
              }
            `
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/*
          iOS Safari swipe-back fix — MUST run synchronously in <head> before first paint.
          Detects back/forward navigation (bfcache restore or navigation type) and sets
          .back-nav on <html> to suppress entrance animations that would flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=performance.getEntriesByType('navigation');if(n.length&&n[0].type==='back_forward'){document.documentElement.classList.add('back-nav')}}catch(e){}window.addEventListener('pageshow',function(e){if(e.persisted){document.documentElement.classList.add('back-nav');document.querySelectorAll('.scroll-reveal').forEach(function(el){el.classList.add('revealed')})}})})();`,
          }}
        />
        {/* Theme — apply before first paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('platewiki_theme');if(t==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClerkProviderWrapper>
        <JsonLd data={orgSchema} />
        <JsonLd data={siteSchema} />
        <Providers>
          <BackNavCleanup />
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="main-content">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
          <UpgradeNudge />
          {process.env.NODE_ENV !== 'production' && <DevToolbar />}
        </Providers>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
