import { useEffect, useRef } from 'react';

/**
 * Custom hook to request a Screen Wake Lock to prevent the screen from sleeping.
 * Automatically releases on unmount or when disabled, and recovers after visibility changes.
 */
export function useWakeLock(enabled: boolean) {
  const sentinelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
      return;
    }

    async function requestWakeLock() {
      if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
        try {
          sentinelRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.warn('Screen Wake Lock request failed:', err);
        }
      }
    }

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [enabled]);
}
