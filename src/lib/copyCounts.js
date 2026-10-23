// Copy counts, saved globally in Neon Postgres — not Abacus, not local.
//
// Frontend path: same-origin Vercel Serverless Function `api/copies.js`,
// which talks to Neon Postgres with the DATABASE_URL env var set on
// Vercel (Production). One row per key in the `copy_counts` table:
//   art-<id> for gallery arts, textgen, canvas, canvas-<timestamp> for
//   published canvas arts.
//   GET  /api/copies?key=art-1  -> { key, count }   (read, no change)
//   POST /api/copies  { key }   -> { key, count }   (atomic +1 in SQL)
// Abacus was the previous global store and is no longer used; Postgres
// counts start fresh (Abacus totals were not migrated).
//
// Fallback: if the API is unreachable or returns 503 (DATABASE_URL not
// configured yet, or local Astro dev which does not serve `api/`),
// counts fall back to this browser's localStorage, so copying still
// records something and the UI still shows a number. Local counts are
// NOT added to the Postgres total — they are only shown when Postgres
// is unavailable.
const API_BASE = "/api/copies";
const LOCAL_KEY = "valoart-copy-counts";

// Gallery arts have numeric ids; keep Postgres keys readable as art-<id>.
function apiKey(id) {
  const s = String(id);
  return /^\d+$/.test(s) ? `art-${s}` : s;
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

// Returns the Postgres count, or null if it could not be read.
export async function getGlobalCopyCount(id) {
  if (!id || typeof fetch === "undefined") return null;
  try {
    const res = await fetch(`${API_BASE}?key=${encodeURIComponent(apiKey(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const value = parseInt(data.count, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

// Increments the Postgres count. Returns the new count, or null
// if the increment could not be recorded (caller falls back to local).
export async function recordGlobalCopy(id) {
  if (!id || typeof fetch === "undefined") return null;
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey(id) }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const value = parseInt(data.count, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}
