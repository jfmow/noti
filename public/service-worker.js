const CACHE_NAME = 'Noti-v0.1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/', // Add the URLs of your static assets here
          '/favicon.ico',
          '/manifest.json',
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
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, networkResponse.clone()); // Update the cache with the new response
          });
        return networkResponse; // Return the fetched response
      })
      .catch(() => {
        return caches.match(event.request); // Serve the cached version if the network request fails
      })
  );
});


self.addEventListener('push', (event) => {
  let notification = event.data.json();

  const notificationOptions = {
    title: notification.title,
    body: notification.options.body,
    icon: notification.icon,
    image: notification.image,
    badge: notification.badge,
    vibrate: notification.vibrate,
    tag: notification.tag,
    data: notification.data,
    actions: notification.actions,
    renotify: notification.renotify,
    requireInteraction: notification.requireInteraction,
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

