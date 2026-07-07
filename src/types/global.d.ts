/** Global type declarations for PlateWiki */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
    webkitAudioContext: typeof AudioContext;
    [key: `ga-disable-${string}`]: boolean;
  }
}

export {};
