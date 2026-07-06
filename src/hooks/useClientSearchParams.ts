'use client';

import { useEffect, useState } from 'react';

/**
 * Read the URL query string after hydration, without opting the page out of
 * static server rendering.
 *
 * Next.js's `useSearchParams()` forces a CSR bailout on statically generated
 * pages: everything below the Suspense boundary is stripped from the
 * prerendered HTML, so crawlers (and any client without JS) receive an empty
 * shell. Views whose query params are progressive enhancements — deep-link
 * filters, back-links, preselected tabs — should use this hook instead:
 * the server HTML renders the default state, and the params apply on mount.
 *
 * Returns `null` during SSR and the first client render, then the parsed
 * `URLSearchParams` after mount.
 */
export function useClientSearchParams(): URLSearchParams | null {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
}
