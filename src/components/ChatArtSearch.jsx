import React from "react";
import { useMemo, useState } from "react";
import { CHAT_ARTS, toAscii } from "../lib/ascii.js";

const CATEGORIES = ["All", "Funny", "Texts", "Cute", "Emojis", "Other"];

export default function ChatArtSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedTitle, setCopiedTitle] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return CHAT_ARTS.filter(
      (art) => (category === "All" || art.cat === category) && art.title.toLowerCase().includes(q)
    );
  }, [query, category]);

  async function copyArt(art) {
    const text = toAscii(art.title.replace(/[^A-Za-z0-9 ?:+.-]/g, "").slice(0, 12) || art.title);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(art.title);
      setTimeout(() => setCopiedTitle(""), 1500);
    } catch {}
  }

  return (
    <section>
      <h2>Valorant Chat Arts</h2>
      <p className="lead">Search the gallery, filter by category, and copy an art.</p>
      <div className="row">
        <input
          type="text"
          value={query}
          placeholder="Search chat arts… e.g. Ace, RR, Funny"
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
          ))}
        </select>
      </div>
      <p className="meta">{results.length} result{results.length === 1 ? "" : "s"}</p>
      <div className="grid">
        {results.map((art) => (
          <article key={art.title} className="card art-card">
            <h3>{art.title}</h3>
            <p className="meta">{art.cat}{art.author ? ` · ${art.author}` : ""}</p>
            <pre>{toAscii(art.title.replace(/[^A-Za-z0-9 ?:+.-]/g, "").slice(0, 12) || art.title)}</pre>
            <button type="button" className="secondary" onClick={() => copyArt(art)}>
              {copiedTitle === art.title ? "Copied!" : "Copy art"}
            </button>
          </article>
        ))}
        {results.length === 0 && <p className="meta">No matches. Try another search.</p>}
      </div>
    </section>
  );
}
