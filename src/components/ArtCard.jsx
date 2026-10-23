import React from "react";
import { useState } from "react";
import { Copy, Heart } from "lucide-react";

// One grid-box card. Art text is passed in as `art` when available —
// the user will give the asciis later, so for now a card can render
// without art text and just show its title / meta, ready to be filled in.
// Props: title, category, copies, author, url, art (optional string).
export default function ArtCard({ title, category, copies, author, url, art }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (art) {
      try {
        await navigator.clipboard.writeText(art);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        return;
      } catch {}
    }
    // No art text supplied yet — open the original page, where it can be copied.
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
        .art-card-box {
          background: #2e2e2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .art-card-preview {
          position: relative;
          background: #242424;
          border-radius: 12px;
          min-height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          margin-bottom: 14px;
          overflow: auto;
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
        .art-card-art {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          line-height: 1.35;
          white-space: pre;
          color: #ece8e1;
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
          color: #ece8e1;
          margin: 0 0 4px;
          padding: 0 4px;
        }
        .art-card-meta {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #b9bfc7;
          font-size: 14px;
          margin: 0 0 12px;
          padding: 0 4px;
        }
        /* Copy button: transparent, appears on card hover (and on focus, for keyboard users) */
        .art-card-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: transparent;
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
        }
        .art-card-box:hover .art-card-copy,
        .art-card-box:focus-within .art-card-copy {
          opacity: 1;
        }
        .art-card-copy:hover {
          background: rgba(255, 255, 255, 0.10);
        }
      `}</style>
    </article>
  );
}
