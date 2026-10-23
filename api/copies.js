// Vercel Serverless Function: global copy counts backed by Neon Postgres.
//
// This is the Postgres replacement for the old Abacus counter. The site
// itself stays a static Astro site; Vercel deploys this file in `api/`
// as a serverless function at the same origin, `/api/copies`.
//
// Env var (set on Vercel, Production): DATABASE_URL
//   Neon Postgres connection string. The pooled (-pooler) string is the
//   right one for serverless traffic, per the neon-postgres skill, but
//   the @neondatabase/serverless driver below uses HTTP, so either the
//   pooled or direct string works here.
// Driver, per the neon-postgres skill for serverless/edge runtimes:
//   @neondatabase/serverless — HTTP transport, one-shot queries, no
//   persistent TCP connection to keep alive between invocations.
//
// API:
//   GET  /api/copies?key=art-1            -> { key, count }
//   GET  /api/copies?keys=art-1,art-2     -> { counts: { "art-1": n, ... } }
//   POST /api/copies  { "key": "art-1" }  -> { key, count }  (atomic +1)
//   POST /api/copies?key=art-1            -> same, for callers without a body
// Keys: letters, digits, hyphen, underscore, max 100 chars.
// Table is created on first use (CREATE TABLE IF NOT EXISTS), so no
// separate migration step is needed before the first copy.
import { neon } from "@neondatabase/serverless";

const KEY_RE = /^[A-Za-z0-9_-]{1,100}$/;

function json(res, status, body) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}

async function getSql(res) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    json(res, 503, { error: "DATABASE_URL not configured" });
    return null;
  }
  const sql = neon(url);
  await sql`
    CREATE TABLE IF NOT EXISTS copy_counts (
      key TEXT PRIMARY KEY,
      count BIGINT NOT NULL DEFAULT 0
    )
  `;
  return sql;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return json(res, 200, {});
  }

  const sql = await getSql(res);
  if (!sql) return; // 503 already sent

  try {
    if (req.method === "GET") {
      const keysParam = req.query?.keys;
      if (keysParam) {
        const keys = String(keysParam)
          .split(",")
          .map((k) => k.trim())
          .filter((k) => KEY_RE.test(k));
        if (!keys.length) return json(res, 400, { error: "invalid keys" });
        const rows = await sql`
          SELECT key, count FROM copy_counts WHERE key = ANY(${keys})
        `;
        const counts = {};
        for (const k of keys) counts[k] = 0;
        for (const row of rows) counts[row.key] = Number(row.count);
        return json(res, 200, { counts });
      }

      const key = req.query?.key;
      if (!key || !KEY_RE.test(String(key))) {
        return json(res, 400, { error: "invalid key" });
      }
      const rows = await sql`
        SELECT count FROM copy_counts WHERE key = ${String(key)}
      `;
      return json(res, 200, { key: String(key), count: rows.length ? Number(rows[0].count) : 0 });
    }

    if (req.method === "POST") {
      let key = req.query?.key;
      if (!key && req.body) {
        key = typeof req.body === "string" ? JSON.parse(req.body).key : req.body.key;
      }
      if (!key || !KEY_RE.test(String(key))) {
        return json(res, 400, { error: "invalid key" });
      }
      // Atomic increment: one statement, even under concurrent copies.
      const rows = await sql`
        INSERT INTO copy_counts (key, count) VALUES (${String(key)}, 1)
        ON CONFLICT (key) DO UPDATE SET count = copy_counts.count + 1
        RETURNING count
      `;
      return json(res, 200, { key: String(key), count: Number(rows[0].count) });
    }

    return json(res, 405, { error: "method not allowed" });
  } catch (err) {
    console.error("copies API error", err);
    return json(res, 500, { error: "database error" });
  }
}
