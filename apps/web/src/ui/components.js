export function cls(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function card(title, bodyHtml, footerHtml = "") {
  return `
  <section class="bg-white border rounded-2xl shadow-sm">
    <div class="p-4 md:p-5 border-b">
      <h2 class="font-semibold text-base md:text-lg">${title}</h2>
    </div>
    <div class="p-4 md:p-5">${bodyHtml}</div>
    ${footerHtml ? `<div class="p-4 md:p-5 border-t">${footerHtml}</div>` : ""}
  </section>`;
}

export function pill(text) {
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-slate-100 border">${escapeHtml(text)}</span>`;
}

export function alertBox(type, text) {
  const map = {
    info: "bg-sky-50 border-sky-200 text-sky-900",
    warn: "bg-amber-50 border-amber-200 text-amber-900",
    error: "bg-rose-50 border-rose-200 text-rose-900",
    ok: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };
  return `<div class="border rounded-xl p-3 text-sm ${map[type] || map.info}">${escapeHtml(text)}</div>`;
}
