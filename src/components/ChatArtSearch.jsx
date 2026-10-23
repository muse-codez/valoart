import React from "react";
import { useMemo, useState } from "react";
import { CHAT_ARTS, toAscii } from "../lib/ascii.js";

// Search only for now — category choice will be added later, when the user tells us the categories.
export default function ChatArtSearch() {
  const [query, setQuery] = useState("");
  const [copiedTitle, setCopiedTitle] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return CHAT_ARTS.filter((art) => art.title.toLowerCase().includes(q));
  }, [query]);

  async function copyArt(art) {
    const text = toAscii(art.title.replace(/[^A-Za-z0-9 ?:+.-]/g, "").slice(0, 12) || art.title);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(art.title);
      setTimeout(() => setCopiedTitle(""), 1500);
    } catch {}
  }

  return (
    <section className="search-section">
      <h2>Search chat arts</h2>
      <p className="lead">Search the gallery and copy an art.</p>
      <div className="row">
        <input
          type="text"
          value={query}
          placeholder="Search chat arts… e.g. Ace, RR, Funny"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="meta">{results.length} result{results.length === 1 ? "" : "s"}</p>
      <div className="grid">
        {results.map((art) => (
          <article key={art.title} className="card art-card">
            <h3>{art.title}</h3>
            {art.author ? <p className="meta">{art.author}</p> : null}
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
