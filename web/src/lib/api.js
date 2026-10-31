// The API address is set at build time with VITE_API_BASE.
// When it is empty, the contact form falls back to the visitor's email app.
const raw = import.meta.env.VITE_API_BASE || "";
export const API_BASE = raw.replace(/\/+$/, "");

export async function sendContact(payload) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 429) throw new Error("rate_limited");
  if (!res.ok) throw new Error("failed");
}

// Counts one visit per browser session. Returns a number, or null if unavailable.
export async function countVisit() {
  if (!API_BASE) return null;
  try {
    const cached = sessionStorage.getItem("visitCount");
    if (cached) return Number(cached);
  } catch {}
  try {
    const res = await fetch(`${API_BASE}/visit`, { method: "POST" });
    if (!res.ok) return null;
    const { count } = await res.json();
    try {
      sessionStorage.setItem("visitCount", String(count));
    } catch {}
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}
