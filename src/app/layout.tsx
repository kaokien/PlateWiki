import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, Lora } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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

const SITE_URL = 'https://foodwiki.org';

export const metadata: Metadata = {
  title: {
    default: 'FoodWiki — Organic Nutrition & Fueling for Athletes',
    template: '%s | FoodWiki',
  },
  description:
    `Free interactive nutrition encyclopedia with ${TECHNIQUE_COUNT}+ foods, dietary guides, and fueling programs. Ideal for fighters, runners, and weightlifters.`,
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'FoodWiki',
    title: 'FoodWiki — Organic Nutrition & Fueling for Athletes',
    description:
      `Free interactive food and nutrition encyclopedia for athletes. Learn pre-workout, post-workout, and gut-health fueling.`,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoodWiki — Organic Nutrition & Fueling for Athletes',
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
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
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
            __html: `(function(){try{var t=localStorage.getItem('foodwiki_theme');if(t==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#2d8a4e',
              colorDanger: '#2d8a4e',
              colorSuccess: '#22c55e',
              colorWarning: '#ffd700',
              colorText: '#ffffff',
              colorTextSecondary: '#e0e0e0',
              colorBackground: '#1c1c1c',
              colorInputBackground: '#252525',
              colorInputText: '#ffffff',
              colorTextOnPrimaryBackground: '#ffffff',
              colorNeutral: '#ffffff',
              colorShimmer: 'rgba(255,255,255,0.05)',
              borderRadius: '0.75rem',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '0.875rem',
              spacingUnit: '1rem',
            },
            elements: {
              rootBox: {
                fontFamily: "'Inter', sans-serif",
              },
              card: {
                background: 'rgba(28, 28, 28, 0.95)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                borderRadius: '1rem',
                color: '#ffffff',
              },

              socialButtonsBlockButton: {
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              },
              socialButtonsBlockButtonText: {
                color: '#ffffff',
              },
              formFieldInput: {
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderRadius: '0.5rem',
                '&::placeholder': {
                  color: '#888888',
                },
                '&:focus': {
                  borderColor: '#2d8a4e',
                  boxShadow: '0 0 0 2px rgba(255, 51, 51, 0.2)',
                },
              },
              formButtonPrimary: {
                background: '#d42a2a',
                fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
                fontWeight: '800',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
                borderRadius: '999px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#2d8a4e',
                },
              },
              footerActionLink: {
                color: '#2d8a4e',
                '&:hover': {
                  color: '#ff4d4d',
                },
              },
              userButtonAvatarBox: {
                width: '32px',
                height: '32px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
              },
              userButtonPopoverCard: {
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.5rem',
                color: '#ffffff',
              },
              userButtonPopoverActions: {
                padding: '0.25rem 0',
              },
              userButtonPopoverActionButton: {
                color: '#ffffff',
                padding: '0.75rem 1rem',
                minHeight: '48px',
                borderRadius: '0.5rem',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                },
              },
              userButtonPopoverActionButtonText: {
                color: '#ffffff',
              },
              userButtonPopoverActionButtonIcon: {
                color: '#ffffff',
              },
              userButtonPopoverFooter: {
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.5rem',
              },
              userPreviewMainIdentifier: {
                color: '#ffffff',
                fontWeight: '600',
              },
              userPreviewSecondaryIdentifier: {
                color: '#e0e0e0',
              },
              userPreviewTextContainer: {
                color: '#ffffff',
              },
              modalBackdrop: {
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
              },
              dividerLine: {
                background: 'rgba(255, 255, 255, 0.1)',
              },
              dividerText: {
                color: '#ffffff',
              },

              formFieldHintText: {
                color: '#cccccc',
              },
              formFieldSuccessText: {
                color: '#22c55e',
              },
              formFieldErrorText: {
                color: '#ff5555',
              },
              identityPreviewText: {
                color: '#ffffff',
              },
              identityPreviewEditButton: {
                color: '#2d8a4e',
              },
              alertText: {
                color: '#ffffff',
              },
              footerActionText: {
                color: '#ffffff',
              },
              otpCodeFieldInput: {
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              },
              menuList: {
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.25rem',
              },
              menuItem: {
                color: '#ffffff',
                padding: '0.75rem 1rem',
                minHeight: '48px',
                borderRadius: '0.5rem',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                },
              },
              // ── Profile / Manage Account modal ──
              profilePage: {
                color: '#ffffff',
              },
              profileSection__profile: {
                color: '#ffffff',
              },
              profileSection__emailAddresses: {
                color: '#ffffff',
              },
              profileSection__connectedAccounts: {
                color: '#ffffff',
              },
              profileSection__danger: {
                color: '#ffffff',
              },
              profileSectionTitle: {
                color: '#ffffff',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              },
              profileSectionTitleText: {
                color: '#ffffff',
                fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
                fontWeight: '800',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
              },
              profileSectionContent: {
                color: '#ffffff',
              },
              profileSectionPrimaryButton: {
                color: '#2d8a4e',
              },
              // All labels, descriptions, and text in profile sections
              formFieldLabel: {
                color: '#ffffff',
              },
              formFieldLabelRow: {
                color: '#ffffff',
              },
              tagInputContainer: {
                color: '#ffffff',
              },
              badge: {
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              },
              // Navbar in manage account modal
              navbar: {
                background: 'rgba(18, 18, 18, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              },
              navbarButton: {
                color: '#ffffff',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                },
              },
              navbarButtonIcon: {
                color: '#ffffff',
              },
              // Page header
              headerTitle: {
                fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
                fontWeight: '800',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
                color: '#ffffff',
              },
              headerSubtitle: {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              // Breadcrumbs and section descriptions
              breadcrumbs: {
                color: '#ffffff',
              },
              breadcrumbsItem: {
                color: 'rgba(255, 255, 255, 0.6)',
              },
              breadcrumbsItemDivider: {
                color: 'rgba(255, 255, 255, 0.3)',
              },
              // Action cards and buttons
              activeDevice: {
                color: '#ffffff',
              },
              activeDeviceListItem: {
                color: '#ffffff',
              },
              // Table rows and account list items
              tableHead: {
                color: 'rgba(255, 255, 255, 0.6)',
              },
              // Catch-all for any remaining text
              text: {
                color: '#ffffff',
              },
            },
          }}
        >
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
        </ClerkProvider>
      </body>
    </html>
  );
}
