// GGPoint Service Worker v1.0.0
const CACHE_NAME = 'ggpoint-cache-v1';

// Файлы для кеширования при установке
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/catalog.html',
  '/about.html',
  '/contacts.html',
  '/keycaps.html',
  '/pads.html',
  '/product.html',
  '/tracking.html',
  '/offline.html',
  '/css/main.css',
  '/js/main.js',
  '/js/firebase-init.js',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png'
];

// CDN ресурсы для кеширования
const CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кеширование файлов...');
        return cache.addAll([...PRECACHE_URLS, ...CDN_URLS]);
      })
      .catch((err) => {
        console.log('[SW] Ошибка кеширования:', err);
      })
  );
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия Cache First для статических ресурсов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Пропускаем Firebase запросы (не кешируем)
  if (url.hostname.includes('firebaseio.com') || 
      url.hostname.includes('googleapis.com') && url.pathname.includes('/firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Стратегия: сначала кеш, потом сеть (Cache First)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((networkResponse) => {
            // Кешируем только успешные GET запросы
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Если нет сети и нет кеша, показываем offline.html для HTML запросов
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            return new Response('Офлайн режим - нет соединения', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Обработка push уведомлений (опционально)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/favicon-32x32.png',
    badge: '/images/favicon-16x16.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('GGPoint', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
