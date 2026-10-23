import React from "react";
import { useEffect, useMemo, useState } from "react";
import { toBannerRows } from "../lib/ascii.js";
import { getCopyCount, getGlobalCopyCount, recordCopy, recordGlobalCopy } from "../lib/copyCounts.js";

// Text Gen section — extra file, as requested.
// Feature from the reference screenshot: turn any phrase into a banner
// in chunky block letters, with quick starts, letter spacing, a
// background fill, a live preview, and a paste-ready copy button.
const QUICK_STARTS = ["GG", "NT", "ACE", "+RR", "AGENT DIFF", "NICE TRY", "ONE MORE", "GLHF"];
const BACKGROUNDS = ["░", "▒", "▓", "·", " "];
const BACKGROUND_NAMES = ["Light shade", "Medium shade", "Dark shade", "Dot", "Blank"];

export default function TextGen() {
  const [text, setText] = useState("GG hi");
  const [spacing, setSpacing] = useState(1);
  const [bgIndex, setBgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    getGlobalCopyCount("textgen").then((global) => {
      if (!cancelled) setCopyCount(global !== null ? global : getCopyCount("textgen"));
    });
    return () => { cancelled = true; };
  }, []);

  const bg = BACKGROUNDS[bgIndex];

  const { displayRows, width, totalChars, pasteReady } = useMemo(() => {
    if (!text.trim()) {
      return { displayRows: [], width: 0, totalChars: 0, pasteReady: "" };
    }
    const rows = toBannerRows(text.slice(0, 16), spacing, bg);
    // Chunky block letters: # -> █, and fill every empty cell with the
    // background character, so the banner is a solid rectangle and
    // joining the rows keeps its shape in VALORANT chat.
    const display = rows.map((r) => r.replaceAll("#", "█").replaceAll(" ", bg));
    const w = display[0] ? display[0].length : 0;
    // Paste-ready: rows joined with a single space between rows, like
    // Valorant Scout (see ArtCard comment). Without the space, VALORANT
    // treats the banner as one long word and wraps mid-row.
    return {
      displayRows: display,
      width: w,
      totalChars: display.join(" ").length,
      pasteReady: display.join(" "),
    };
  }, [text, spacing, bg]);

  async function handleCopy() {
    if (!pasteReady) return;
    try {
      await navigator.clipboard.writeText(pasteReady);
      const global = await recordGlobalCopy("textgen");
      setCopyCount(global !== null ? global : recordCopy("textgen"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {}
  }

  return (
    <section className="textgen-section">
      <div className="textgen-grid">
        <div className="textgen-panel">
          <h2>Turn any phrase into a banner</h2>
          <p className="lead">Up to 16 characters, in chunky block letters.</p>

          <label className="field-label" htmlFor="textgen-input">Your text</label>
          <input
            id="textgen-input"
            type="text"
            className="textgen-input"
            value={text}
            maxLength={16}
            placeholder="Type a phrase…"
            onChange={(e) => setText(e.target.value)}
          />
          <p className="meta">{text.length} / 16 characters</p>

          <p className="field-label">Quick starts</p>
          <div className="quick-starts">
            {QUICK_STARTS.map((q) => (
              <button key={q} type="button" className="quick-button" onClick={() => setText(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="spacing-row">
            <label className="field-label" htmlFor="textgen-spacing">Letter spacing</label>
            <span className="spacing-value">{spacing}</span>
          </div>
          <input
            id="textgen-spacing"
            type="range"
            min="0"
            max="3"
            step="1"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
            className="spacing-slider"
          />

          <div className="style-box">
            <div>
              <p className="field-label" style={{ margin: 0 }}>Customize style</p>
              <p className="meta" style={{ margin: "4px 0 0" }}>
                Background {bg === " " ? "blank" : bg} · {BACKGROUND_NAMES[bgIndex]}
              </p>
            </div>
            <button type="button" className="change-button" onClick={() => setBgIndex((i) => (i + 1) % BACKGROUNDS.length)}>
              Change
            </button>
          </div>
        </div>

        <div className="textgen-panel">
          <div className="preview-header">
            <div>
              <h3>Live VALORANT preview</h3>
              <p className="meta" style={{ margin: "4px 0 0" }}>
                {displayRows.length} rows · {width} wide · {totalChars} characters
              </p>
            </div>
            {pasteReady && <span className="chat-ready">Chat ready</span>}
          </div>
          <div className="preview-box">
            {displayRows.length > 0 ? (
              <pre className="preview-art">{displayRows.join("\n")}</pre>
            ) : (
              <p className="meta">Type a phrase to see it here.</p>
            )}
          </div>
          <button type="button" className={copied ? "copy-ready-button is-copied" : "copy-ready-button"} onClick={handleCopy} disabled={!pasteReady}>
            <span key={copied ? "copied" : "copy"} style={{display:"inline-block", animation:"copy-label-in 0.8s cubic-bezier(0.22, 1, 0.36, 1)"}}>{copied ? "✓ Copied!" : "Copy paste-ready art"}</span>
          </button>
          {copyCount > 0 && (
            <p className="meta" style={{ marginTop: 8 }}>
              {copyCount} {copyCount === 1 ? "copy" : "copies"} total
            </p>
          )}
          <p className="meta" style={{ marginTop: 12 }}>
            We fill empty cells and join the rows with a space so the shape survives VALORANT chat. Copy here, then press Ctrl+V in game.
          </p>
        </div>
      </div>

      <style>{`
        .textgen-section { padding: 20px 0 80px; }
        .textgen-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }
        .textgen-panel {
          background: #2e2e2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 20px;
        }
        .textgen-panel h2 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #ece8e1;
          margin: 0 0 6px;
        }
        .textgen-panel h3 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #ece8e1;
          margin: 0;
        }
        .textgen-panel .lead {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          margin: 0 0 18px;
        }
        .textgen-panel .meta {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #b9bfc7;
          font-size: 14px;
        }
        .field-label {
          display: block;
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          font-size: 14px;
          margin: 16px 0 8px;
        }
        .textgen-input {
          width: 100%;
          box-sizing: border-box;
          background: #242424;
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 16px;
          font-family: 'Noto Sans Mono', monospace;
        }
        .quick-starts { display: flex; flex-wrap: wrap; gap: 8px; }
        .quick-button {
          background: rgba(255, 255, 255, 0.08);
          color: #ece8e1;
          border: 0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
        }
        .quick-button:hover { background: rgba(255, 255, 255, 0.16); }
        .spacing-row { display: flex; justify-content: space-between; align-items: center; }
        .spacing-value { font-family: 'Figtree', system-ui, sans-serif; color: #ece8e1; }
        .spacing-slider { width: 100%; accent-color: #ff4655; }
        .style-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #242424;
          border-radius: 10px;
          padding: 14px;
          margin-top: 18px;
        }
        .change-button {
          background: transparent;
          color: #ff4655;
          border: 0;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .preview-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .chat-ready {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          padding: 6px 10px;
          white-space: nowrap;
        }
        .preview-box {
          background: #242424;
          border-radius: 12px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          margin-top: 16px;
          overflow: auto;
        }
        .preview-art {
          margin: 0;
          font-family: 'Noto Sans Mono', 'DejaVu Sans Mono', Consolas, monospace;
          font-size: 14px;
          line-height: 1;
          white-space: pre;
          color: #ece8e1;
          text-align: center;
        }
        @keyframes copy-label-in {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .copy-ready-button {
          width: 100%;
          background: #ff4655;
          transition: background-color 0.8s cubic-bezier(0.22, 1, 0.36, 1), color 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          animation: copy-label-in 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          color: #fff;
          border: 0;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
          margin-top: 16px;
        }
        .copy-ready-button:hover:not(:disabled) { transform: scale(1.02); }
        .copy-ready-button:active:not(:disabled) { transform: scale(0.98); }
        .copy-ready-button.is-copied { background: #22c55e; box-shadow: 0 0 24px rgba(34, 197, 94, 0.25); }
        .copy-ready-button:disabled { opacity: 0.5; cursor: default; }
        @media (max-width: 800px) {
          .textgen-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
