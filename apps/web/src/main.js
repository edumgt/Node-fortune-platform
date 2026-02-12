import "../styles/tailwind.css";

import { initOffcanvas } from "./ui/offcanvas.js";
import { onRouteChange, getRoute } from "./router.js";

import { HomePage, HomeMount } from "./pages/Home.js";
import { SajuResultPage, SajuResultMount } from "./pages/SajuResult.js";
import { DaeunPage, DaeunMount } from "./pages/Daeun.js";
import { GunghapPage, GunghapMount } from "./pages/Gunghap.js";
import { DailyFortunePage, DailyFortuneMount } from "./pages/DailyFortune.js";
import { API_BASE } from "./api.js";

const state = { form: null, lastResult: null };

function render() {
  const app = document.getElementById("app");
  const path = getRoute();

  const routes = {
    "/": { view: () => HomePage(state), mount: () => HomeMount(state) },
    "/result": { view: () => SajuResultPage(state), mount: () => SajuResultMount(state) },
    "/daeun": { view: () => DaeunPage(state), mount: () => DaeunMount(state) },
    "/gunghap": { view: () => GunghapPage(state), mount: () => GunghapMount(state) },
    "/daily": { view: () => DailyFortunePage(state), mount: () => DailyFortuneMount(state) },
  };

  const route = routes[path] || routes["/"];
  app.innerHTML = route.view();
  route.mount();

  const label = document.getElementById("apiBaseLabel");
  if (label) label.textContent = API_BASE;

  document.querySelectorAll("a.nav-link").forEach((a) => {
    a.className =
      "nav-link block px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 active:scale-[0.99] transition";
    if (a.getAttribute("href") === `#${path}` || (path === "/" && a.getAttribute("href") === "#/")) {
      a.className =
        "nav-link block px-3 py-2 rounded-xl border bg-slate-900 text-white hover:bg-slate-900 transition";
    }
  });
}

initOffcanvas();
onRouteChange(render);
