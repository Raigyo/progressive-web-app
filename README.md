# PWA

March 2021

> 🔨  From udemy: [Les Progressive Web Apps (PWA) par la pratique - Code Concept](https://www.udemy.com/course/les-progressive-web-apps-pwa-par-la-pratique)

* * *


![logo](_readme-img/pwa.png)

## Concepts

Progressive Web Apps are web apps that use emerging web browser APIs and features along with traditional progressive enhancement strategy to bring a native app-like user experience to cross-platform web applications. Progressive Web Apps are a useful design pattern, though they aren't a formalized standard. PWA can be thought of as similar to AJAX or other similar patterns that encompass a set of application attributes, including use of specific web technologies and techniques. This set of docs tells you all you need to know about them.

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

### Cache management

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
  console.log("install: ", evt);
  const cachePromise = caches.open(cacheName).then((cache) => {
    return cache.addAll([
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
  evt.waitUntill(cachePromise);
});
````

**service-worker.js: Strategy 1: Cache only with Network Fallback**

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

**service-worker.js: Strategy 2: Network first with cache fallback**
````js
evt.respondWith(
    fetch(evt.request)
      // from network to cache
      .then((res) => {
        console.log(`fetched url from network: ${evt.request.url}`);
        caches.open(cacheName).then((cache) => cache.put(evt.request, res));
        return res.clone();
      })
      // otherwhise cache
      .catch((err) => {
        console.log(`fetched url from cache: ${evt.request.url}`);
        return caches.match(evt.request);
      })
  );
````

**service-worker.js: Delete older instances in cache**

````js
self.addEventListener("activate", (evt) => {
  console.log("activate: ", evt);
  // delete older instances in cache
  let cacheCleanedPromise = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    });
  });
  evt.waitUntill(cacheCleanedPromise);
});
````

### Manifest

The web app manifest provides information about a web application in a JSON text file, necessary for the web app to be downloaded and be presented to the user similarly to a native app (e.g., be installed on the homescreen of a device, providing users with quicker access and a richer experience). PWA manifests include its name, author, icon(s), version, description, and list of all the necessary resources (among other things).

**manifest.json**

````json
{
  "theme_color": "#f69435",
  "background_color": "#f69435",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "name": "techno watch",
  "short_name": "tecnho-watch",
  "icons": [
    {
      "src": "images/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
````

![install-capture](_readme-img/install-capture.png)

### Notification

- Non-persistent: Sent via a web application (automatically close)
- Persistent: Sent via Service Worker/Push API (stay in notification center)

#### Non persistant - from main.js

````js
if (window.Notification && window.Notification !== "denied") {
  Notification.requestPermission((perm) => {
    if (perm === "granted") {
      const options = {
        body: "Modification body",
        icon: "images/icons/icon-72x72.png",
      };
      const notif = new Notification("Hello notification", options);
    } else {
      console.log("Authorization of notifications refused");
    }
  });
}
````

![notif-capture](_readme-img/notif-capture-01.png)

#### Persistant - from service-worker.js

````js
self.registration.showNotification(
  "Persistant Notification from service worker",
  {
    body: "Notification body",
    icon: "images/icons/icon-72x72.png",
  }
);
````

#### Persistant with actions - from service-worker.js

````js
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
````

![notif-capture](_readme-img/notif-capture-02.png)

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
- [Progressive web apps (PWAs)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [ExtendableEvent.waitUntil()](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil)
- [Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Notifications API: Advanced Progressive Web Apps](https://www.thinktecture.com/en/pwa/push-notifications-api/)
