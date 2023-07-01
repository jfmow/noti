const CACHE_NAME = 'Noti-v0.3';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/', // Add the URLs of your static assets here
          '/favicon.ico',
          '/manifest.json',
          '/offline.html',
          '/simple-todo.js',
          'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest',
          'https://cdn.jsdelivr.net/npm/@editorjs/table@latest',
          'https://cdn.jsdelivr.net/npm/@editorjs/header@latest',
          'https://cdn.jsdelivr.net/npm/@editorjs/list@latest',
          'https://cdn.jsdelivr.net/npm/@editorjs/quote@latest'
          // Include other static assets such as images, icons, etc.
        ]);
      })
      .then(() => {
        console.log('Service worker installed');
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => {
            return name !== CACHE_NAME;
          }).map((name) => {
            return caches.delete(name);
          })
        );
      })
      .then(() => {
        console.log('Service worker activated');
      })
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
        })
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
  }
});





self.addEventListener('push', (event) => {
  let notification = event.data.json();

  const notificationOptions = {
    title: notification.title,
    body: notification.options.body,
    icon: notification.icon,
    image: notification.image,
    badge: notification.badge,
    vibrate: [700, 300, 700, 700, 300, 700], //Add vibrate property with an array of durations in milliseconds
    tag: notification.tag,
    data: notification.data,
    actions: notification.actions,
    renotify: notification.renotify,
    requireInteraction: true, // Set requireInteraction to true for highest priority
    silent: notification.silent,
    timestamp: notification.timestamp,
    dir: notification.dir,
    lang: notification.lang
  };

  self.registration.showNotification(
    notification.title,
    notificationOptions
  );
});