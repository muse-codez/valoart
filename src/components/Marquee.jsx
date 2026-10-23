import React, { useEffect, useRef, useState } from "react";
import { GALLERY_ARTS } from "../lib/gallery.js";
import { PROMO_ART } from "../lib/promo.js";

// Landing-page marquee: promo + first 11 gallery arts, duplicated for a
// seamless loop. Each card uses the SAME fit-to-box preview as ArtCard:
// measure the art at its natural size, then scale it to fit the preview
// in BOTH width and height, centred, so no art is clipped on the
// left/right/bottom and no art sits as a tiny strip in a corner.
// The old marquee used a fixed 9px <pre> with max-height 120px, left
// aligned and overflow hidden — tall arts (up to 14 rows in this set)
// were cut off at the bottom, and wide/block-heavy arts were cut off
// on the right when the fallback font was wider than Noto Sans Mono.
const MARQUEE_ARTS = [PROMO_ART, ...GALLERY_ARTS.slice(0, 11)];

function MarqueeCard({ art, link }) {
  const [scale, setScale] = useState(1);
  const previewRef = useRef(null);
  const artRef = useRef(null);

  useEffect(() => {
    if (!previewRef.current || !artRef.current) return;
    const update = () => {
      const preview = previewRef.current;
      const el = artRef.current;
      if (!preview || !el) return;
      const innerW = preview.clientWidth - 20;
      const innerH = preview.clientHeight - 20;
      const naturalW = el.scrollWidth;
      const naturalH = el.scrollHeight;
      if (!naturalW || !naturalH || !innerW || !innerH) return;
      const next = Math.min(innerW / naturalW, innerH / naturalH, 1.6);
      if (next > 0 && Math.abs(next - scale) > 0.01) setScale(next);
    };
    update();
    window.addEventListener("resize", update);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [art.art]);

  const inner = (
    <>
      <div className="marquee-preview" ref={previewRef}>
        <pre className="marquee-art" ref={artRef} style={{ transform: `scale(${scale})` }}>{art.art}</pre>
      </div>
      <span className="marquee-title">{art.title}</span>
    </>
  );

  return link ? (
    <a className="marquee-card" href="/arts">{inner}</a>
  ) : (
    <div className="marquee-card" aria-hidden="true">{inner}</div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee-section" aria-label="Featured arts">
      <div className="marquee">
        <div className="marquee-track">
          {MARQUEE_ARTS.map((art) => (
            <MarqueeCard key={`a-${art.id}`} art={art} link />
          ))}
          {MARQUEE_ARTS.map((art) => (
            <MarqueeCard key={`b-${art.id}`} art={art} link={false} />
          ))}
        </div>
      </div>

      <style>{`
        /* Marquee: slow, seamless, pauses on hover */
        .marquee-section { padding: 20px 0 40px; }
        .marquee {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* No flex gap on the track: gap breaks the -50% loop, because
           the total width is then 2*W + (2N-1)*gap, not 2*(W+gap), so
           every loop jumps by half a gap. Cards carry their own
           right margin instead, so the track is exactly 2 identical
           halves and the loop is seamless. */
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
        }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .marquee-card {
          display: block;
          flex-shrink: 0;
          width: 220px;
          margin-right: 16px;
          background: #2e2e2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px;
          text-decoration: none;
          color: #ece8e1;
          box-sizing: border-box;
        }
        .marquee-preview {
          background: #242424;
          border-radius: 12px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-bottom: 10px;
          overflow: hidden;
          box-sizing: border-box;
        }
        .marquee-art {
          margin: 0;
          width: max-content;
          max-width: none;
          font-family: 'Noto Sans Mono', 'DejaVu Sans Mono', Consolas, 'Courier New', monospace;
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0;
          font-variant-ligatures: none;
          white-space: pre;
          word-break: normal;
          overflow: visible;
          color: #ece8e1;
          text-align: center;
          transform-origin: center;
          flex-shrink: 0;
        }
        .marquee-title {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          padding: 0 2px;
        }
      `}</style>
    </section>
  );
}
