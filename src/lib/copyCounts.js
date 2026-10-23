// Copy counts, saved globally — not just on one device.
//
// Global store: Abacus, a free public counter API with no account, no
// API key, and open CORS, made for exactly this (static sites with no
// backend). One namespace for this site, one key per art/generator:
//   GET  https://abacus.jasoncameron.dev/get/<namespace>/<key>  (read, no change)
//   GET  https://abacus.jasoncameron.dev/hit/<namespace>/<key>  (increment, returns new value)
// A 404 on /get means the key has never been hit: a definite 0.
// Trade-offs, stated plainly: keys are public, so anyone who knows the
// namespace/key could hit a counter, and the service is a free community
// project, not our own database. For copy counts (not money, not auth)
// that is acceptable. A private, abuse-proof global count would need our
// own backend (e.g. Vercel KV) — that is a separate setup step.
//
// Fallback: if the global API is unreachable (offline, CORS, rate limit),
// counts fall back to this browser's localStorage, so copying still
// records something and the UI still shows a number. Local counts are
// NOT added to the global total — they are only shown when global is
// unavailable.
const GLOBAL_BASE = "https://abacus.jasoncameron.dev";
const NAMESPACE = "valoart-muse-codez";
const LOCAL_KEY = "valoart-copy-counts";

function globalKey(id) {
  // Gallery arts have numeric ids; generators use their own names.
  return String(id).startsWith("art-") || id === "textgen" || id === "canvas" || String(id).startsWith("canvas-")
    ? String(id)
    : `art-${id}`;
}

function readLocalAll() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getCopyCount(id) {
  if (!id) return 0;
  return readLocalAll()[id] || 0;
}

export function recordCopy(id) {
  if (!id) return 0;
  const all = readLocalAll();
  const next = (all[id] || 0) + 1;
  all[id] = next;
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch {}
  return next;
}

// Returns the global count, or null if it could not be read.
export async function getGlobalCopyCount(id) {
  if (!id || typeof fetch === "undefined") return null;
  try {
    const res = await fetch(`${GLOBAL_BASE}/get/${NAMESPACE}/${encodeURIComponent(globalKey(id))}`, {
      cache: "no-store",
    });
    if (res.status === 404) return 0;
    if (!res.ok) return null;
    const data = await res.json();
    const value = parseInt(data.value, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

// Increments the global count. Returns the new global count, or null
// if the increment could not be recorded (caller falls back to local).
export async function recordGlobalCopy(id) {
  if (!id || typeof fetch === "undefined") return null;
  try {
    const res = await fetch(`${GLOBAL_BASE}/hit/${NAMESPACE}/${encodeURIComponent(globalKey(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const value = parseInt(data.value, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}
