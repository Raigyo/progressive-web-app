/* Main: load json server datas, load service workers, subscriptions */

console.log("hello depuis main");
const technosDiv = document.querySelector("#technos");

function loadTechnologies() {
  // fetch("http://localhost:3001/technos")
  fetch(
    "https://raigyo-pwa-json.herokuapp.com/technos"
  )
    .then((response) => {
      response.json().then((technos) => {
        const allTechnos = technos
          .map(
            (t) =>
              `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`
          )
          .join("");

        technosDiv.innerHTML = allTechnos;
      });
    })
    .catch(console.error);
}

loadTechnologies(technos);

// if("serviceWorker" in navigator){
// if (navigator.serviceWorker) {
//   navigator.serviceWorker
//     .register("service-worker.js")
//     .catch((err) => console.error);
// }

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        // Public vapid key - should be send using server
        const publicKey =
          "BGM2Ld5GpBXX-sc47KbdsMphvA8f_Vmd3e88lmF2fw3qxmGmuhLf1NkifelEK9PsMsV9A_DouB8Psz-94MO9iCk";
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            console.log("Already suscribed: ", subscription);
            extractKeysFromArrayBuffer(subscription);
            return subscription;
          } else {
            // ask for subscription
            const convertKey = urlBase64ToUint8Array(publicKey);
            return registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertKey,
              })
              .then((newSubscription) => {
                console.log("New subscription: ", newSubscription);
                extractKeysFromArrayBuffer(subscription);
                return subscription;
              });
          }
        });
      });
  });
}

function extractKeysFromArrayBuffer(subscription) {
  // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
  const keyArrayBuffer = subscription.getKey("p256dh");
  const authArrayBuffer = subscription.getKey("auth");
  const p256dh = btoa(
    String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer))
  );
  const auth = btoa(
    String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer))
  );
  console.log("p256dh key", keyArrayBuffer, p256dh);
  console.log("auth key", authArrayBuffer, auth);
}

// if (window.caches) {
//   caches.open("cache watch opened").then((cache) => {
//     cache.addAll(["index.html", "main.js", "/vendors/bootstrap.min.css"]);
//   });
// }

/* Non persistant notifications */

// if (window.Notification && window.Notification !== "denied") {
//   Notification.requestPermission((perm) => {
//     if (perm === "granted") {
//       const options = {
//         body: "Notification body",
//         icon: "images/icons/icon-72x72.png",
//       };
//       const notif = new Notification(
//         "Non persistant notification from JS",
//         options
//       );
//     } else {
//       console.log("Authorization of notifications refused");
//     }
//   });
// }

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
