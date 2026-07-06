'use client';

import { useEffect } from 'react';

/**
 * Companion to the inline <head> script in layout.tsx.
 *
 * The inline script adds .back-nav to <html> BEFORE first paint to suppress
 * entrance animations on back/forward navigation.
 *
 * This component removes .back-nav after hydration + a short delay so that
 * subsequent in-page interactions (modals, tooltips, hover effects) still
 * get their animations. Without this cleanup, ALL animations stay disabled.
 */
export default function BackNavCleanup() {
  useEffect(() => {
    if (document.documentElement.classList.contains('back-nav')) {
      // Wait for page to fully settle, then re-enable animations
      const timer = setTimeout(() => {
        document.documentElement.classList.remove('back-nav');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
