// Copy counts, saved per copy-button click.
//
// This site is a static Astro site with no backend/database, so there is
// no server to store a global count for all visitors. What we CAN save
// reliably right now is per-visitor: every successful copy is recorded
// in this browser's localStorage, keyed by art id (or "textgen" /
// "canvas" for those generators), and it survives reloads on that device.
// A global, all-visitors count would need a backend (e.g. a small API +
// database / Vercel KV) — that is a separate setup step, not a change
// to these components.
const KEY = "valoart-copy-counts";

function readAll() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getCopyCount(id) {
  if (!id) return 0;
  return readAll()[id] || 0;
}

export function getAllCopyCounts() {
  return readAll();
}

// Returns the new count for this id after incrementing.
export function recordCopy(id) {
  if (!id) return 0;
  const all = readAll();
  const next = (all[id] || 0) + 1;
  all[id] = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
  return next;
}
