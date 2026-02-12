export function getRoute() {
  const hash = location.hash || "#/";
  const path = hash.replace(/^#/, "");
  return path || "/";
}

export function onRouteChange(fn) {
  window.addEventListener("hashchange", fn);
  window.addEventListener("load", fn);
}
