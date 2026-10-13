// Offline support: the whole app is cached on first visit. Bump VERSION whenever any file changes.
const VERSION = 'helpie-v4';
const IMAGES = [
  'logo', 'q-breathnach', 'q-black', 'q-selye', 'q-eaton', 'q-james', 'q-rubin',
  'cards', 'making-faces', 'guessing-game', 'story-game', 'matching-games',
  'emotions-survey', 'stress-survey', 'anger-survey', 'chat', 'professional',
  'candy', 'website', 'contact', 'feelings-game', 'fg-step1', 'fg-step2', 'fg-step3', 'fg-step4',
  'stress-measure', 'sm-step1', 'sm-step2', 'sm-step3',
  'school-logo', 'unesco', 'school',
];
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/portal-content.js', 'js/ui.js', 'js/api.js', 'js/apk.js', 'js/portal.js', 'js/admin.js', 'js/app.js',
  'icons/favicon-48.png', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png',
  ...IMAGES.map(n => `img/${n}.webp`),
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !font) return;

  // Network first for the page itself so updates show up at once.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }
  // Everything else: answer from the cache straight away, and refresh the cache in the background
  // so an edited file shows up on the next visit.
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req);
    const fresh = fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    return fresh;
  }));
});
