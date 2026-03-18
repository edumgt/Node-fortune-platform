import "../styles/tailwind.css";

import { initOffcanvas } from "./ui/offcanvas.js";
import { onRouteChange, getRoute } from "./router.js";

import { HomePage, HomeMount } from "./pages/Home.js";
import { SajuResultPage, SajuResultMount } from "./pages/SajuResult.js";
import { DaeunPage, DaeunMount } from "./pages/Daeun.js";
import { GunghapPage, GunghapMount } from "./pages/Gunghap.js";
import { DailyFortunePage, DailyFortuneMount } from "./pages/DailyFortune.js";
import { LoginPage, LoginMount } from "./pages/Login.js";
import { RegisterPage, RegisterMount } from "./pages/Register.js";
import { API_BASE, getUser, logout } from "./api.js";

const state = { form: null, lastResult: null };

function renderUserBadge() {
  const user = getUser();
  const el = document.getElementById("userBadge");
  if (!el) return;
  if (user) {
    el.innerHTML = `
      <div class="flex items-center gap-2 px-3 py-2 text-sm text-slate-700">
        <span class="font-medium truncate max-w-[120px]">${user.name || user.email}</span>
        <button id="logoutBtn" class="text-xs text-slate-500 underline">로그아웃</button>
      </div>`;
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
  } else {
    el.innerHTML = `
      <div class="flex gap-2 px-3 py-2">
        <a href="#/login" class="text-sm underline text-slate-600">로그인</a>
        <span class="text-slate-300">|</span>
        <a href="#/register" class="text-sm underline text-slate-600">회원가입</a>
      </div>`;
  }
}

function render() {
  const app = document.getElementById("app");
  const path = getRoute();

  const routes = {
    "/": { view: () => HomePage(state), mount: () => HomeMount(state) },
    "/result": { view: () => SajuResultPage(state), mount: () => SajuResultMount(state) },
    "/daeun": { view: () => DaeunPage(state), mount: () => DaeunMount(state) },
    "/gunghap": { view: () => GunghapPage(state), mount: () => GunghapMount(state) },
    "/daily": { view: () => DailyFortunePage(state), mount: () => DailyFortuneMount(state) },
    "/login": { view: () => LoginPage(), mount: () => LoginMount() },
    "/register": { view: () => RegisterPage(), mount: () => RegisterMount() },
  };

  const route = routes[path] || routes["/"];
  app.innerHTML = route.view();
  route.mount();

  const label = document.getElementById("apiBaseLabel");
  if (label) label.textContent = API_BASE;

  renderUserBadge();

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
