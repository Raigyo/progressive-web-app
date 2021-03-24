/* Service workers */

console.log("hello from sw");
const cacheName = "cache-watch-opened-1.3";

self.addEventListener("install", (evt) => {
  console.log("install: ", evt);
  const cachePromise = caches.open(cacheName).then((cache) => {
    return cache
      .addAll([
        "index.html",
        "main.js",
        "style.css",
        "vendors/bootstrap.min.css",
        "add_techno.html",
        "add_techno.js",
        "contact.html",
        "contact.js",
      ])
      .then(console.log("Cache initiated"))
      .catch(console.err);
  });
  evt.waitUntil(cachePromise);
});

self.addEventListener("activate", (evt) => {
  console.log(`sw activated at ${new Date().toLocaleTimeString()}`);
  let cacheCleanedPromise = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    });
  });
  evt.waitUntil(cacheCleanedPromise);
});

self.addEventListener("fetch", (evt) => {
  /* Alternative content if no network */
  // console.log("navigator.onLine: ", navigator.onLine);
  // if (!navigator.online) {
  //   const headers = { headers: { "Content-Type": "text/html;charset-utf-8" } };
  //   evt.respondWith(
  //     new Response("<h2>Pas de connexion internet</h2>", headers)
  //   );
  // }
  console.log("fetch: ", evt.request.url);

  /* Strategy 1: Cache only with Network Fallback */
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      console.log(`fetched url from cache: ${evt.request.url}`, res);
      // cache
      if (res) {
        return res;
      }
      // otherwise network
      return fetch(evt.request).then((newResponse) => {
        console.log(
          `fetched url from network to cache: ${evt.request.url}`,
          res
        );
        caches
          .open(cacheName)
          .then((cache) => cache.put(evt.request, newResponse));
        return newResponse.clone(); // we can't send the same response twice so we clone it
      });
    })
  );

  /* Strategy 2: Network first with cache fallback */
  // evt.respondWith(
  //   fetch(evt.request)
  //     // from network to cache
  //     .then((res) => {
  //       console.log(`fetched url from network: ${evt.request.url}`);
  //       caches.open(cacheName).then((cache) => cache.put(evt.request, res));
  //       return res.clone();
  //     })
  //     // otherwhise cache
  //     .catch((err) => {
  //       console.log(`fetched url from cache: ${evt.request.url}`);
  //       return caches.match(evt.request);
  //     })
  // );
});

/* Persistant notifications */

self.registration.showNotification(
  "Persistant Notification from service worker",
  {
    body: "Notification body",
    icon: "images/icons/icon-72x72.png",
    actions: [
      { action: "accept", title: "Accept" },
      { action: "refuse", title: "Refuse" },
    ],
  }
);

self.addEventListener("notificationclose", (evt) => {
  console.log("Notification closed", evt);
});

self.addEventListener("notificationclick", (evt) => {
  if (evt.action === "accept") {
    console.log("You have accepted");
  } else if (evt.action === "refuse") {
    console.log("You have refused");
  } else {
    console.log("You clicked on the notification (not on one of the buttons)");
  }
  evt.notification.close();
});

/* Push event (notification from Push Server)*/

self.addEventListener("push", (evt) => {
  console.log("push event: ", evt);
  console.log("push event data: ", evt.data.text());
  const title = evt.data.text();
  evt.waitUntil(
    self.registration.showNotification(title, {
      body: "Push notification",
      image: "images/icons/icon-96x96.png",
    })
  );
});
