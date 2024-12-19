const CACHE_NAME = 'cutting-machine-v4';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './img/info/rails.png',
    './img/info/wid.png',
    './img/info/len.png',
    './img/info/all_diagonals.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
