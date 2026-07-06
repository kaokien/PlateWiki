'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { StanceProvider } from '@/context/StanceContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { FighterProfileProvider, useFighterProfile } from '@/context/FighterProfileContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useLocalReminders } from '@/hooks/useLocalReminders';
import { useCloudSync } from '@/hooks/useCloudSync';
import { migrateLocalStorageSchema } from '@/utils/storage';

// Gamification overlays are event-triggered chrome — none of them paint
// anything at load. Dynamic imports keep them (and their CSS) out of the
// initial bundle; their chunks load after hydration, off the critical path.
const XPToast = dynamic(() => import('@/components/XPToast'), { ssr: false });
const RankUpModal = dynamic(() => import('@/components/RankUpModal'), { ssr: false });
const FirstBloodModal = dynamic(() => import('@/components/FirstBloodModal'), { ssr: false });
const BadgeUnlockToast = dynamic(() => import('@/components/BadgeUnlockToast'), { ssr: false });
const StorageQuotaWarning = dynamic(() => import('@/components/StorageQuotaWarning'), { ssr: false });
const CloudSyncNudge = dynamic(() => import('@/components/CloudSyncNudge'), { ssr: false });
const DailyRewardPopup = dynamic(() => import('@/components/DailyRewardPopup'), { ssr: false });

/** Thin wrapper — consumes context to drive the First Blood modal. */
function FirstBloodBridge() {
  const { firstBloodEvent, clearFirstBloodEvent } = useFighterProfile();
  return <FirstBloodModal isOpen={firstBloodEvent} onClose={clearFirstBloodEvent} />;
}

/** Syncs localStorage → Supabase when user is signed in via Clerk. */
function CloudSyncBridge() {
  useCloudSync();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize daily training reminders check
  useLocalReminders();

  React.useEffect(() => {
    // Intercept localStorage.setItem to safely report quota/private browsing write lockouts
    if (typeof window !== 'undefined') {
      try {
        if (window.localStorage) {
          const originalSetItem = window.localStorage.setItem;
          window.localStorage.setItem = function (key, value) {
            try {
              originalSetItem.call(window.localStorage, key, value);
            } catch (err) {
              console.warn('Storage write failed, triggering warning event:', err);
              window.dispatchEvent(new CustomEvent('storage-lockout-error'));
              throw err;
            }
          };
        }
      } catch (e) {
        console.warn('Failed to intercept localStorage.setItem:', e);
      }
    }

    migrateLocalStorageSchema();

    // Register Service Worker for offline capabilities (PWA support)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => { if (process.env.NODE_ENV !== 'production') console.log('ServiceWorker registered with scope:', reg.scope); })
        .catch((err) => console.error('ServiceWorker registration failed:', err));
    }
  }, []);

  return (
    <StanceProvider>
      <SubscriptionProvider>
        <FighterProfileProvider>
          <ErrorBoundary>
            {children}
            <XPToast />
            <RankUpModal />
            <FirstBloodBridge />
            <BadgeUnlockToast />
            <StorageQuotaWarning />
            <CloudSyncBridge />
            <CloudSyncNudge />
            <DailyRewardPopup />
          </ErrorBoundary>
        </FighterProfileProvider>
      </SubscriptionProvider>
    </StanceProvider>
  );
}

