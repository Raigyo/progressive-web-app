console.log("hello depuis main");
const technosDiv = document.querySelector("#technos");

function loadTechnologies() {
  fetch("http://localhost:3001/technos")
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
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("service-worker.js")
    .catch((err) => console.error);
}

// if (window.caches) {
//   caches.open("cache watch opened").then((cache) => {
//     cache.addAll(["index.html", "main.js", "/vendors/bootstrap.min.css"]);
//   });
// }
