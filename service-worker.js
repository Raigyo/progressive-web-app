console.log("hello from sw");
const cacheName = "cache-watch-opened";

self.addEventListener("install", (evt) => {
  console.log("install: ", evt);
  caches.open(cacheName).then((cache) => {
    cache.addAll([
      "index.html",
      "main.js",
      "style.css",
      "vendors/bootstrap.min.css",
      "add_techno.html",
      "add_techno.js",
      "contact.html",
      "contact.js",
    ]);
  });
});

self.addEventListener("activate", (evt) => {
  console.log("activate: ", evt);
});

self.addEventListener("fetch", (evt) => {
  // console.log("navigator.onLine: ", navigator.onLine);
  // if (!navigator.online) {
  //   const headers = { headers: { "Content-Type": "text/html;charset-utf-8" } };
  //   evt.respondWith(
  //     new Response("<h2>Pas de connexion internet</h2>", headers)
  //   );
  // }
  console.log("fetch: ", evt.request.url);
  // Cache only with Network Fallback
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
});
