/** Global type declarations for FoodWiki */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
    webkitAudioContext: typeof AudioContext;
    [key: `ga-disable-${string}`]: boolean;
  }
}

export {};
