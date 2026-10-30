const CACHE = "papj-v3";

const PRECACHE = [
  "/manifest.json",
  "/logo.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  /* Pass through everything except same-origin static icons/images */
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.match(/\.(png|ico|svg|webp|jpg|jpeg|woff2?)$/)
  ) {
    return; /* let the browser handle it normally */
  }

  /* Cache-first for static icons only */
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        /* Only cache successful opaque-safe responses */
        if (res.status === 200 && res.type !== "opaque") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
