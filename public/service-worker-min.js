const CACHE_NAME = "Noti-v0.35"; self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_NAME).then(e => e.addAll(["/", "/favicon.ico", "/manifest.json", "/offline/offline.html", "/offline/editor.js", "/offline/header.js", "/offline/list.js", "/offline/quote.js", "/offline/table.js", "/offline/savestuff.js", "/offline/todo.js", "/offline/loadstuff.js", "/offline/marker.js"])).then(() => { })) }), self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(e => Promise.all(e.filter(e => e !== CACHE_NAME).map(e => caches.delete(e)))).then(() => { })) }), self.addEventListener("fetch", e => { e.request.url === self.location.origin + "/" && e.respondWith(fetch(e.request).then(t => (caches.open(CACHE_NAME).then(i => { i.put(e.request, t.clone()) }), t)).catch(() => caches.match("/offline/offline.html"))), e.request.url.includes(self.location.origin + "/offline") && e.respondWith(fetch(e.request).then(t => (caches.open(CACHE_NAME).then(i => { i.put(e.request, t.clone()) }), t)).catch(() => caches.match(e.request))) }), self.addEventListener("push", e => { let t = e.data.json(), i = { title: t.title, body: t.options.body, icon: t.icon, image: t.image, badge: t.badge, vibrate: [700, 300, 700, 700, 300, 700], tag: t.tag, data: t.data, actions: t.actions, renotify: t.renotify, requireInteraction: !0, silent: t.silent, timestamp: t.timestamp, dir: t.dir, lang: t.lang }; self.registration.showNotification(t.title, i) });