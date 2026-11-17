/* abliterated.ai Service Worker — offline PWA + smart API caching */
const CACHE_NAME = 'abliterated-v9';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

// Precache on install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(()=> self.skipWaiting())
  );
});

// Clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=> k!==CACHE_NAME).map(k=> caches.delete(k)))).then(()=> self.clients.claim())
  );
});

// Strategy: cache-first for static, network-first for APIs, fallback to offline
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isApi = url.pathname.startsWith('/api/') || url.hostname.includes('aihorde.net') || url.hostname.includes('pollinations.ai') || url.hostname.includes('llm7.io');
  const isStatic = STATIC_ASSETS.some(a=> url.pathname.endsWith(a.replace('./',''))) || e.request.destination === 'document' || e.request.destination === 'style' || e.request.destination === 'script';

  if (isApi) {
    // Network first with 4s timeout fallback to cache
    e.respondWith(
      (async () => {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(()=> ctrl.abort(), 4000);
          const res = await fetch(e.request, { signal: ctrl.signal });
          clearTimeout(t);
          // Cache successful API model lists
          if (res.ok && url.pathname.includes('/models')) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c=> c.put(e.request, clone));
          }
          return res;
        } catch {
          const cached = await caches.match(e.request);
          if (cached) return cached;
          return new Response(JSON.stringify({error: 'offline', offline: true}), { status: 503, headers: {'Content-Type':'application/json'}});
        }
      })()
    );
    return;
  }

  if (isStatic || e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(res=>{
          if(res.ok) caches.open(CACHE_NAME).then(c=> c.put(e.request, res.clone()));
          return res;
        }).catch(()=> cached || caches.match('./index.html'));
        return cached || fetchPromise;
      })
    );
  }
});

// Push notifications (future: model ready)
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: 'abliterated.ai', body: 'Your abliterated model is ready' };
  e.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: './icons/icon-192.png', badge: './icons/icon-192.png' }));
});

// Background sync for queued chats when offline -> online
self.addEventListener('sync', (e) => {
  if (e.tag === 'ablit-sync') e.waitUntil(clients.matchAll().then(cs=> cs.forEach(c=> c.postMessage({type:'sync'}))));
});
