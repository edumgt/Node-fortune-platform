const DEFAULT_API_BASE = "http://localhost:3000";

export const API_BASE = (localStorage.getItem("API_BASE") || DEFAULT_API_BASE).trim();

async function jpost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export function setApiBase(next) {
  localStorage.setItem("API_BASE", next);
  location.reload();
}

export async function calcSaju(input) {
  return jpost("/api/saju/calc", input);
}

export async function calcGunghap(a, b) {
  return jpost("/api/gunghap", { a, b });
}
