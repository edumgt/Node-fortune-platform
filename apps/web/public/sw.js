/* Service Worker for Fortune Platform Push Notifications */
const CACHE_NAME = "fortune-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("push", (e) => {
  let data = { title: "오늘의 운세 🔮", body: "오늘의 운세를 확인하세요!", url: "/#/daily" };
  if (e.data) {
    try { data = { ...data, ...JSON.parse(e.data.text()) }; } catch {}
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url || "/#/daily" },
      requireInteraction: false,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/#/daily";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const win of wins) {
        if (win.url.includes(location.origin)) {
          win.focus();
          win.postMessage({ type: "navigate", url });
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
