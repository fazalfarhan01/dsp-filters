const cacheName = 'dsp-filters-v1';
const staticAssets = [
    "/",
    "/index.html",
    "/assets/js/main.js",
    "/assets/js/util.js",
    "/assets/js/jquery.scrolly.min.js",
    "/assets/js/jquery.scrollex.min.js",
    "/assets/js/jquery.min.js",
    "/assets/js/browser.min.js",
    "/assets/js/breakpoints.min.js",
    "/assets/js/logic/contactForm.js",
    "/assets/css/fontawesome-all.min.css",
    "/assets/css/main.css",
    "/assets/css/noscript.css",
    "/assets/css/images/close.svg",
    "/assets/css/images/intro.svg",
    "/images/favicon.png",
    "/images/favicon.ico",
    "/manifest.webmanifest",
    "/assets/webfonts/fa-brands-400.eot",
    "/assets/webfonts/fa-brands-400.svg",
    "/assets/webfonts/fa-brands-400.ttf",
    "/assets/webfonts/fa-brands-400.woff",
    "/assets/webfonts/fa-brands-400.woff2",
    "/assets/webfonts/fa-regular-400.svg",
    "/assets/webfonts/fa-regular-400.eot",
    "/assets/webfonts/fa-regular-400.ttf",
    "/assets/webfonts/fa-regular-400.woff2",
    "/assets/webfonts/fa-regular-400.woff",
    "/assets/webfonts/fa-solid-900.eot",
    "/assets/webfonts/fa-solid-900.svg",
    "/assets/webfonts/fa-solid-900.ttf",
    "/assets/webfonts/fa-solid-900.woff",
    "/assets/webfonts/fa-solid-900.woff2",
    "assets/js/pwa/index.js",
];

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.clients.claim();
});

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//       fetch(event.request).catch(function () {
//         return caches.match(event.request);
//       }),
//     );
//   });

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(networkAndCache(req));
    } else {
        e.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}