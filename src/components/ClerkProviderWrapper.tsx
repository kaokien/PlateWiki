'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { ReactNode } from 'react';

// Use a valid-format fallback publishable key if the env var is missing,
// preventing useUser/Clerk context crashes during build and runtime.
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_ZGl2aW5lLXZlcnZldC0yNy5jbGVyay5hY2NvdW50cy5kZXYk';

const clerkAppearance = {
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
    rootBox: { fontFamily: "'Inter', sans-serif" },
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
      '&:hover': { background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' },
    },
    socialButtonsBlockButtonText: { color: '#ffffff' },
    formFieldInput: {
      background: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      borderRadius: '0.5rem',
      '&::placeholder': { color: '#888888' },
      '&:focus': { borderColor: '#2d8a4e', boxShadow: '0 0 0 2px rgba(255, 51, 51, 0.2)' },
    },
    formButtonPrimary: {
      background: '#2d8a4e',
      fontFamily: "'Inter', sans-serif",
      fontWeight: '700',
      letterSpacing: '0.5px',
      borderRadius: '999px',
      transition: 'all 0.2s ease',
      '&:hover': { background: '#236e3e' },
    },
    footerActionLink: { color: '#2d8a4e', '&:hover': { color: '#22c55e' } },
    userButtonAvatarBox: { width: '32px', height: '32px', border: '2px solid rgba(255, 255, 255, 0.1)' },
    userButtonPopoverCard: {
      background: 'rgba(20, 20, 20, 0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      padding: '0.5rem',
      color: '#ffffff',
    },
    userButtonPopoverActions: { padding: '0.25rem 0' },
    userButtonPopoverActionButton: {
      color: '#ffffff', padding: '0.75rem 1rem', minHeight: '48px', borderRadius: '0.5rem',
      '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
    },
    userButtonPopoverActionButtonText: { color: '#ffffff' },
    userButtonPopoverActionButtonIcon: { color: '#ffffff' },
    userButtonPopoverFooter: { borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '0.5rem' },
    userPreviewMainIdentifier: { color: '#ffffff', fontWeight: '600' },
    userPreviewSecondaryIdentifier: { color: '#e0e0e0' },
    userPreviewTextContainer: { color: '#ffffff' },
    modalBackdrop: { background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' },
    dividerLine: { background: 'rgba(255, 255, 255, 0.1)' },
    dividerText: { color: '#ffffff' },
    formFieldHintText: { color: '#cccccc' },
    formFieldSuccessText: { color: '#22c55e' },
    formFieldErrorText: { color: '#ff5555' },
    identityPreviewText: { color: '#ffffff' },
    identityPreviewEditButton: { color: '#2d8a4e' },
    alertText: { color: '#ffffff' },
    footerActionText: { color: '#ffffff' },
    otpCodeFieldInput: { color: '#ffffff', background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.15)' },
    menuList: { background: 'rgba(20, 20, 20, 0.95)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '0.25rem' },
    menuItem: {
      color: '#ffffff', padding: '0.75rem 1rem', minHeight: '48px', borderRadius: '0.5rem',
      '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
    },
    profilePage: { color: '#ffffff' },
    profileSection__profile: { color: '#ffffff' },
    profileSection__emailAddresses: { color: '#ffffff' },
    profileSection__connectedAccounts: { color: '#ffffff' },
    profileSection__danger: { color: '#ffffff' },
    profileSectionTitle: { color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
    profileSectionTitleText: { color: '#ffffff', fontWeight: '800' },
    profileSectionContent: { color: '#ffffff' },
    profileSectionPrimaryButton: { color: '#2d8a4e' },
    formFieldLabel: { color: '#ffffff' },
    formFieldLabelRow: { color: '#ffffff' },
    tagInputContainer: { color: '#ffffff' },
    badge: { color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' },
    navbar: { background: 'rgba(18, 18, 18, 0.95)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' },
    navbarButton: { color: '#ffffff', '&:hover': { background: 'rgba(255, 255, 255, 0.06)' } },
    navbarButtonIcon: { color: '#ffffff' },
    headerTitle: { fontWeight: '800', color: '#ffffff' },
    headerSubtitle: { color: 'rgba(255, 255, 255, 0.7)' },
    breadcrumbs: { color: '#ffffff' },
    breadcrumbsItem: { color: 'rgba(255, 255, 255, 0.6)' },
    breadcrumbsItemDivider: { color: 'rgba(255, 255, 255, 0.3)' },
    activeDevice: { color: '#ffffff' },
    activeDeviceListItem: { color: '#ffffff' },
    tableHead: { color: 'rgba(255, 255, 255, 0.6)' },
    text: { color: '#ffffff' },
  },
};

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={clerkAppearance}
    >
      {children}
    </ClerkProvider>
  );
}
