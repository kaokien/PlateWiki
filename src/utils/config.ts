const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://platewiki.org';
};

export const SITE_URL = getSiteUrl();
export const SITE_NAME = 'PlateWiki';
export const ORG_NAME = 'PlateWiki';
