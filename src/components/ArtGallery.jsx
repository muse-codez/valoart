import React from "react";
import { useMemo, useState } from "react";
import { Copy, Heart } from "lucide-react";
import { GALLERY_ARTS } from "../lib/gallery.js";
import SearchBar from "./SearchBar.jsx";

export default function ArtGallery() {
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState({});

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return GALLERY_ARTS.filter((art) => art.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="gallery-section">
      <h2>Chat arts</h2>
      <p className="lead">Search these 5 arts, then open one to copy it on the original gallery.</p>
      <SearchBar value={query} onChange={setQuery} placeholder="Search these arts…" />
      <p className="meta">{results.length} art{results.length === 1 ? "" : "s"}</p>
      <div className="grid">
        {results.map((art) => (
          <article key={art.title} className="card art-card">
            <div className="preview">
              <button
                type="button"
                className="heart"
                aria-label={`Like ${art.title}`}
                onClick={() => setLiked((prev) => ({ ...prev, [art.title]: !prev[art.title] }))}
              >
                <Heart size={18} fill={liked[art.title] ? "#ff4655" : "none"} color={liked[art.title] ? "#ff4655" : "#ece8e1"} />
              </button>
              <a className="preview-link" href={art.url} target="_blank" rel="noopener noreferrer">
                <span className="preview-summary">{art.summary}</span>
                <span className="preview-action">View art on Valorant Scout →</span>
              </a>
            </div>
            <h3>{art.title}</h3>
            <p className="meta">
              {art.category} · {art.copies}{art.author ? ` · ${art.author}` : ""}
            </p>
            <a className="copy-button" href={art.url} target="_blank" rel="noopener noreferrer">
              <Copy size={15} /> Copy art on original
            </a>
          </article>
        ))}
        {results.length === 0 && <p className="meta">No matches. Try another search.</p>}
      </div>
      <p className="meta gallery-note">
        Arts are from the Valorant Scout gallery, linked to their original pages. Only these 5 are on this site.
      </p>
    </section>
  );
}
