const CACHE_NAME = "campus-event-planner-shell-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/graduation-hat2.png"
];

self.addEventListener("install", (event) => {
  console.log("service worker installing ...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("service worker activating ...");

  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  console.log("service worker fetching ...");

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});