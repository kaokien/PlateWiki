const CACHE_VERSION = 'v2';
const STATIC_CACHE = `bw-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bw-dynamic-${CACHE_VERSION}`;

// App shell: only truly static files that will always exist
const APP_SHELL = [
  '/',
  '/favicon.svg',
];

// Install — cache the app shell (tolerates individual fetch failures)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        APP_SHELL.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — Network-first for HTML and page data, Cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from our own origin
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // NEVER intercept Next.js RSC payloads or internal routing — these must always
  // hit the network. Caching them causes stale navigation and "click twice" bugs.
  if (
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-State-Tree') ||
    url.searchParams.has('_rsc') ||
    url.pathname.startsWith('/_next/data')
  ) return;

  // Cache-first for static assets (NOT JS — JS uses network-first for fresh deploys)
  if (url.pathname.match(/\.(css|png|jpg|jpeg|svg|webp|woff2|ico)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for JS bundles (ensures deploys take effect immediately)
  if (url.pathname.match(/\.(js)$/) || url.pathname.startsWith('/_next/static/chunks')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Network-first for page HTML and data payload routes
  if (
    request.headers.get('Accept')?.includes('text/html') ||
    request.headers.get('Accept')?.includes('text/x-component') ||
    url.pathname.startsWith('/articles') ||
    url.pathname.startsWith('/glossary') ||
    url.pathname.startsWith('/workout') ||
    url.pathname.startsWith('/timer')
  ) {
    event.respondWith(networkFirst(request));
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}
