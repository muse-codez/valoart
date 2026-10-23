import React from "react";
import { useState } from "react";
import { Copy, Heart } from "lucide-react";

// One grid-box card, always the same size.
// Props: title, category, copies, author, url, art (optional string).
export default function ArtCard({ title, category, copies, author, url, art }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Proper VALORANT-chat copying: do NOT copy with newlines, and do NOT
  // trim or re-wrap rows. Join the rows into one line, preserving every
  // character in each row exactly. VALORANT chat then wraps that single
  // line back into the art's shape, so the art does not break.
  async function handleCopy() {
    if (art) {
      const pasteReady = art.split(/\r?\n/).join("");
      try {
        await navigator.clipboard.writeText(pasteReady);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        return;
      } catch {}
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="art-card-box">
      <div className="art-card-preview">
        <button
          type="button"
          className="art-card-heart"
          aria-label={`Like ${title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={18} fill={liked ? "#ff4655" : "none"} color={liked ? "#ff4655" : "#ece8e1"} />
        </button>
        {art ? (
          <pre className="art-card-art">{art}</pre>
        ) : (
          <span className="art-card-placeholder">Art coming soon</span>
        )}
      </div>
      <h3 className="art-card-title">{title}</h3>
      <p className="art-card-meta">
        {category} · {copies}{author ? ` · ${author}` : ""}
      </p>
      <button type="button" className="art-card-copy" onClick={handleCopy}>
        <Copy size={15} /> {copied ? "Copied!" : "Copy art"}
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
        /* Art quality: tight line-height (1, not 1.35, so blocks stay square
           instead of stretched tall), a font with proper block / box-drawing
           / symbol coverage, no ligatures, no wrapping, no scrollbars. */
        .art-card-art {
          margin: 0;
          max-width: 100%;
          font-family: 'DejaVu Sans Mono', 'Noto Sans Mono', Consolas, 'Courier New', monospace;
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0;
          font-variant-ligatures: none;
          white-space: pre;
          word-break: normal;
          overflow: hidden;
          color: #ece8e1;
          text-align: center;
        }
        .art-card-placeholder {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #9aa0a8;
          font-size: 14px;
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
        }
        .art-card-copy:hover {
          background: rgba(255, 255, 255, 0.10);
        }
      `}</style>
    </article>
  );
}
