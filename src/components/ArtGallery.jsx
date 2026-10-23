import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_ARTS } from "../lib/gallery.js";
import { PROMO_ART } from "../lib/promo.js";
import { buildSlugMap, getSlugById } from "../lib/slug.js";

const SLUG_MAP = buildSlugMap(GALLERY_ARTS);
import SearchBar from "./SearchBar.jsx";
import ArtCard from "./ArtCard.jsx";

const PAGE_SIZE = 24;

export default function ArtGallery({ extraArts = [] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);
  // Canvas publish handoff: /canvas saves published arts to
  // sessionStorage and navigates here, so they show at the top of /arts
  // even though Canvas and Arts are now separate pages.
  const [sessionPublished, setSessionPublished] = useState([]);
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("valoart-published");
      if (raw) setSessionPublished(JSON.parse(raw));
    } catch {}
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return [...sessionPublished, ...extraArts, ...GALLERY_ARTS].filter((art) => art.title.toLowerCase().includes(q));
  }, [query, extraArts, sessionPublished]);

  // Reset to the first 24 whenever the search changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  // Auto-load the next 24 when the user scrolls near the bottom.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, results.length));
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [results.length]);

  const visible = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  return (
    <>
    {/* Truly pinned promo: always at the top of the Arts tab, above the
        search and the scrolling gallery. It is NOT part of `results`, so
        searching or scrolling the gallery can never hide it. */}
    <section className="pinned-promo">
      <p className="pinned-label">Pinned</p>
      <h2>Spread ValoArt</h2>
      <p className="lead">Copy this promo art and paste it in VALORANT chat — it promotes ruvix.lol.</p>
      <div className="pinned-grid">
        <ArtCard {...PROMO_ART} slug="promo-ruvix" />
      </div>
    </section>
    <section className="gallery-section">
      <h2>Chat arts</h2>
      <p className="lead">Search these arts. Copy button is at the bottom of every card. Scroll to load more.</p>
      <SearchBar value={query} onChange={setQuery} placeholder="Search these arts…" />
      <p className="meta">
        Showing {visible.length} of {results.length} art{results.length === 1 ? "" : "s"}
        {hasMore ? " — scroll to load more" : ""}
      </p>
      <div className="gallery-grid">
        {visible.map((art) => (
          <ArtCard key={art.id ?? art.title} {...art} slug={art.id && SLUG_MAP.has(art.id) ? getSlugById(SLUG_MAP, art) : undefined} />
        ))}
        {results.length === 0 && <p className="meta">No matches. Try another search.</p>}
      </div>
      {hasMore && <div ref={sentinelRef} className="gallery-sentinel" aria-hidden="true" />}
      {!hasMore && results.length > 0 && <p className="meta gallery-end">End of gallery.</p>}

      <style>{`
        /* Pinned promo: highlighted, wider than a gallery card, always on top */
        .pinned-promo {
          padding: 20px 0 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          margin-bottom: 10px;
        }
        .pinned-promo .pinned-label {
          display: inline-block;
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          background: #ff4655;
          border-radius: 999px;
          padding: 6px 12px;
          margin: 0 0 14px;
        }
        .pinned-promo h2 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 4vw, 40px);
          color: #ece8e1;
          margin: 0 0 8px;
        }
        .pinned-promo .lead {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 400;
          color: #d8dde2;
          margin: 0 0 18px;
        }
        .pinned-grid {
          display: grid;
          grid-template-columns: min(420px, 100%);
          gap: 16px;
        }
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
        .gallery-sentinel { height: 1px; }
        .gallery-end { margin-top: 18px; text-align: center; }
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
    </>
  );
}
