import React from "react";
import { useMemo, useState } from "react";
import { GALLERY_ARTS } from "../lib/gallery.js";
import SearchBar from "./SearchBar.jsx";
import ArtCard from "./ArtCard.jsx";

export default function ArtGallery() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return GALLERY_ARTS.filter((art) => art.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="gallery-section">
      <h2>Chat arts</h2>
      <p className="lead">Search these arts. Hover a card to reveal its copy button.</p>
      <SearchBar value={query} onChange={setQuery} placeholder="Search these arts…" />
      <p className="meta">{results.length} art{results.length === 1 ? "" : "s"}</p>
      <div className="gallery-grid">
        {results.map((art) => (
          <ArtCard key={art.title} {...art} />
        ))}
        {results.length === 0 && <p className="meta">No matches. Try another search.</p>}
      </div>

      <style>{`
        .gallery-section { padding: 20px 0 80px; }
        .gallery-section h2 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 4vw, 40px);
          color: #ece8e1;
          margin: 0 0 8px;
        }
        .gallery-section .lead {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 400;
          color: #d8dde2;
          margin: 0 0 18px;
        }
        .gallery-section .meta {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #b9bfc7;
          font-size: 14px;
        }
        /* One row, 4 cards */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
