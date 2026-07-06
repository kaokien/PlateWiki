'use client';
import React, { useEffect, useRef } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import './AdBanner.css';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const FORMATS = {
    horizontal: { width: 728, height: 90, slot: 'XXXXXXXXXX' },
    rectangle: { width: 300, height: 250, slot: 'XXXXXXXXXX' },
  } as const;

type FormatKey = keyof typeof FORMATS;

const AdBanner = ({ format = 'horizontal', className = '' }: { format?: FormatKey; className?: string }) => {
  const adRef = useRef(null);
  const { isPro } = useSubscription();

  const config = FORMATS[format] || FORMATS.horizontal;

  useEffect(() => {
    // Only try to push ads if AdSense script is loaded
    if (isPro) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense not loaded (development / adblocker) — fail silently
    }
  }, [isPro]);

  // Pro subscribers see no ads
  if (isPro) return null;

  // Check if AdSense is available
  const adsenseLoaded = typeof window !== 'undefined' && window.adsbygoogle;

  return (
    <div
      className={`ad-banner-container ${format} ${className}`}
      style={{ minHeight: config.height }}
      role="complementary"
      aria-label="Advertisement"
    >
      {adsenseLoaded ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: config.width, height: config.height }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={config.slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </div>
  );
};

export default AdBanner;
