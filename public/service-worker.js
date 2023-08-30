const CACHE_NAME = 'Noti-v0.35';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/', // Add the URLs of your static assets here
          '/Favicon.png',
          '/manifest.json',
          '/offline/offline.html',
          '/offline/editor.js',
          '/offline/header.js',
          '/offline/list.js',
          '/offline/quote.js',
          '/offline/table.js',
          '/offline/savestuff.js',
          '/offline/todo.js',
          '/offline/loadstuff.js',
          '/offline/marker.js'
          // Include other static assets such as images, icons, etc.
        ]);
      })
      .then(() => {
        //console.log('Service worker installed');
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
        //console.log('Service worker activated');
      })
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/offline/offline.html');
        })
    );
  }
  if (event.request.url.includes(self.location.origin + '/offline')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
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

