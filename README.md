# PWA

March 2021

> 🔨  From udemy: [Les Progressive Web Apps (PWA) par la pratique - Code Concept](https://www.udemy.com/course/les-progressive-web-apps-pwa-par-la-pratique)

* * *


![logo](_readme-img/pwa.png)

## Concepts

### Service Worker API

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests and take appropriate action based on whether the network is available, and update assets residing on the server. They will also allow access to push notifications and background sync APIs.

**main.js: start SW**

````js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("service-worker.js")
    .catch((err) => console.error);
}
````

**service-worker.js: check if offline and send response**

````js
self.addEventListener("fetch", (evt) => {
  if (!navigator.online) {
    const headers = { headers: { "Content-Type": "text/html;charset-utf-8" } };
    evt.respondWith(
      new Response("<h2>Pas de connexion internet</h2>", headers)
    );
  }
});
````

**main.js: open cache**

````js
if (window.caches) {
  caches.open("cache watch opened");
  caches.open("cache other opened");
  caches.keys().then(console.log);
}
````

**service-worker.js: put some pages in cache**

````js
self.addEventListener("install", (evt) => {
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
````

**service-worker.js: Cache only with Network Fallback**

````js
self.addEventListener("fetch", (evt) => {
 evt.respondWith(
    caches.match(evt.request).then((res) => {
      // cache
      if (res) {
        return res;
      }
      // otherwise network
      return fetch(evt.request).then((newResponse) => {
        caches
          .open(cacheName)
          .then((cache) => cache.put(evt.request, newResponse));
        return newResponse.clone(); // we can't send the same response twice so we clone it
      });
    })
  );
});
````

## Dependancies

- [live-server](https://www.npmjs.com/package/live-server): This is a little development server with live reload capability. Use it for hacking your HTML/JavaScript/CSS files, but not for deploying the final site.

`npm i live-server`

- [json-server](https://www.npmjs.com/package/json-server): Get a full fake REST API with zero coding in less than 30 seconds .

`npm i json-server`

`live-server --port=3000`

To launch server on a json, here *db.json*:

`json-server -p 3001 --watch db.json`


## Useful links

- [codeconcept/pwa_veilletechno](https://github.com/codeconcept/pwa_veilletechno)
- [codeconcept/nodetestapi](https://github.com/codeconcept/nodetestapi)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
