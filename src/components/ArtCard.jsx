import React from "react";
import { useEffect, useRef, useState } from "react";
import { Copy, Heart } from "lucide-react";
import { getCopyCount, getGlobalCopyCount, recordCopy, recordGlobalCopy } from "../lib/copyCounts.js";

// One grid-box card, always the same size.
// Props: id, title, category, copies, author, url, art (optional string).
export default function ArtCard({ id, title, category, url, art, slug }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  // Global copies for this card, for all visitors. Loaded on mount;
  // falls back to this device's local count if the global API is down.
  // Cards show no count until the global total is > 0 — the old
  // original-site copy numbers were removed earlier and are not
  // restored here.
  const [copyCount, setCopyCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const key = id || title;
    getGlobalCopyCount(key).then((global) => {
      if (!cancelled) setCopyCount(global !== null ? global : getCopyCount(key));
    });
    return () => { cancelled = true; };
  }, [id, title]);
  const [scale, setScale] = useState(1);
  const previewRef = useRef(null);
  const artRef = useRef(null);

  // Fit-to-box: measure the art at its natural size, then scale it so it
  // fits the fixed preview box in BOTH width and height — never clipped
  // on the left/right/bottom, and small/wide arts are enlarged to fill
  // the preview instead of sitting as a tiny strip. This fixes the
  // cropping seen on the live site, where a fixed font size rendered
  // wider than the preview in some browsers/fonts.
  useEffect(() => {
    if (!art || !previewRef.current || !artRef.current) return;
    const update = () => {
      const preview = previewRef.current;
      const el = artRef.current;
      if (!preview || !el) return;
      const innerW = preview.clientWidth - 24;
      const innerH = preview.clientHeight - 24;
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
  }, [art]);

  // Proper VALORANT-chat copying: do NOT copy with newlines, and do NOT
  // trim or re-wrap rows. Join the rows into one line with a SINGLE
  // SPACE between rows, preserving every character in each row exactly.
  // This is exactly what Valorant Scout does, proven by character
  // counts: our old no-separator copy was 234 chars / 1 word / 0 spaces
  // for a 9-row art, theirs was 242 chars / 9 words / 8 spaces — the
  // same art plus one space per row gap. Without that space, VALORANT
  // treats the whole art as one long word and wraps (or truncates) it
  // mid-row, so only the first line looks right. With a space at each
  // row boundary, VALORANT wraps at the space, i.e. at each row, so the
  // art keeps its shape.
  async function handleCopy() {
    if (art) {
      const pasteReady = art.split(/\r?\n/).join(" ");
      try {
        await navigator.clipboard.writeText(pasteReady);
        // Only count a copy once the clipboard write actually succeeded.
        // Global first; local only if the global API is unreachable.
        const key = id || title;
        const global = await recordGlobalCopy(key);
        setCopyCount(global !== null ? global : recordCopy(key));
        setCopied(true);
        // Slow, lazy fade-back: copied state lingers, then eases out
        // over 0.8s (see .art-card-copy transition below), not a snap.
        setTimeout(() => setCopied(false), 2400);
        return;
      } catch {}
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="art-card-box">
      <div className={copied ? "art-card-preview is-copied" : "art-card-preview"} ref={previewRef}>
        <button
          type="button"
          className="art-card-heart"
          aria-label={`Like ${title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={18} fill={liked ? "#ff4655" : "currentColor"} color={liked ? "#ff4655" : "#ece8e1"} />
        </button>
        {art ? (
          <pre className="art-card-art" ref={artRef} style={{ transform: `scale(${scale})` }}>{art}</pre>
        ) : (
          <span className="art-card-placeholder">Art coming soon</span>
        )}
      </div>
      <h3 className="art-card-title">{slug ? <a href={`/art/${slug}`}>{title}</a> : title}</h3>
      <p className="art-card-meta">
        {category}
        {copyCount > 0 ? ` · ${copyCount} ${copyCount === 1 ? "copy" : "copies"}` : ""}
      </p>
      <button type="button" className={copied ? "art-card-copy is-copied" : "art-card-copy"} onClick={handleCopy}>
        <span key={copied ? "copied" : "copy"} className="art-card-copy-label"><Copy size={15} fill="currentColor" /> {copied ? "Copied!" : "Copy art"}</span>
      </button>

      <style>{`
        /* Same size for every card: fixed preview, single-line title/meta,
           copy button pushed to the bottom (margin-top: auto), always visible. */
        .art-card-box {
          background: #2e2e2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
        }
        .art-card-preview {
          position: relative;
          background: #242424;
          border-radius: 12px;
          height: 200px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          margin-bottom: 14px;
          overflow: hidden;
          box-sizing: border-box;
        }
        .art-card-heart {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 4px;
          z-index: 1;
        }
        @keyframes icon-flip { 0% { transform: perspective(500px) rotateY(0deg) scale(1); } 50% { transform: perspective(500px) rotateY(180deg) scale(1.15); } 100% { transform: perspective(500px) rotateY(360deg) scale(1); } }
        .art-card-heart:hover svg, .art-card-copy:hover .art-card-copy-label svg { animation: icon-flip 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        /* Art quality: tight line-height (1, not 1.35, so blocks stay square
           instead of stretched tall), a font with proper block / box-drawing
           / symbol coverage, no ligatures, no wrapping, no scrollbars. */
        .art-card-art {
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
        .art-card-placeholder {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #9aa0a8;
          font-size: 14px;
        }
        .art-card-title a {
          color: #ece8e1;
          text-decoration: none;
        }
        .art-card-title a:hover {
          color: #ff8a93;
          text-decoration: underline;
        }
        .art-card-title {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 24px;
          height: 24px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #ece8e1;
          margin: 0 0 4px;
          padding: 0 4px;
        }
        .art-card-meta {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #b9bfc7;
          font-size: 14px;
          line-height: 20px;
          height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 12px;
          padding: 0 4px;
        }
        /* Smooth, slow, lazy copy animation: every change eases over
           0.8s with a lazy ease-out curve, never a snap. The preview
           glows softly when copied, then eases back out. */
        .art-card-preview {
          transition: box-shadow 0.8s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .art-card-preview.is-copied {
          box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.45), 0 0 24px rgba(74, 222, 128, 0.18);
        }
        @keyframes copy-label-in {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Copy button: transparent, always visible, same place on every card */
        .art-card-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-top: auto;
          background: transparent;
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
          opacity: 1;
          transition: background-color 0.8s cubic-bezier(0.22, 1, 0.36, 1), color 0.8s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .art-card-copy:hover {
          background: rgba(255, 255, 255, 0.10);
          transform: scale(1.02);
        }
        .art-card-copy:active {
          transform: scale(0.98);
        }
        .art-card-copy.is-copied {
          background: rgba(34, 197, 94, 0.16);
          border-color: rgba(74, 222, 128, 0.55);
          color: #4ade80;
        }
        .art-card-copy-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          animation: copy-label-in 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </article>
  );
}
