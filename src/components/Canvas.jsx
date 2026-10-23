import React from "react";
import { useEffect, useRef, useState } from "react";
import { Undo, Redo, Contrast, FlipHorizontal, ArrowLeft, ArrowRight, Trash, Plus, Copy, Upload, Keyboard } from "lucide-react";
import { getCopyCount, getGlobalCopyCount, recordCopy, recordGlobalCopy } from "../lib/copyCounts.js";

// Canvas section — extra file, as requested.
// Paint on a 26-column chat canvas, like the reference screenshot:
// every cell becomes one character in chat.
const WIDTH = 26;
const BACKGROUNDS = ["░", "▒", "▓", "·", " "];
const BACKGROUND_NAMES = ["Light shade", "Medium shade", "Dark shade", "Dot", "Blank"];

function emptyGrid(rows) {
  return Array.from({ length: rows }, () => Array(WIDTH).fill(false));
}
function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}
function gridToRows(grid, bg) {
  return grid.map((row) => row.map((filled) => (filled ? "█" : bg)).join(""));
}

export default function Canvas({ onPublish }) {
  const [rows, setRows] = useState(7);
  const [grid, setGrid] = useState(() => emptyGrid(7));
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [published, setPublished] = useState(false);
  useEffect(() => {
    let cancelled = false;
    getGlobalCopyCount("canvas").then((global) => {
      if (!cancelled) setCopyCount(global !== null ? global : getCopyCount("canvas"));
    });
    return () => { cancelled = true; };
  }, []);
  const paintingRef = useRef(null); // true = painting, false = erasing, null = not painting

  const bg = BACKGROUNDS[bgIndex];
  const previewRows = gridToRows(grid, bg);
  // Paste-ready: rows joined with a single space between rows, like
  // Valorant Scout (see ArtCard comment). Without the space, VALORANT
  // treats the art as one long word and wraps mid-row.
  const totalChars = previewRows.join(" ").length;
  const pasteReady = previewRows.join(" ");

  function pushHistory(current) {
    setHistory((h) => [...h, cloneGrid(current)]);
    setFuture([]);
  }

  function applyGrid(next) {
    setGrid(next);
  }

  function doAction(fn) {
    pushHistory(grid);
    applyGrid(fn(cloneGrid(grid)));
  }

  function handleUndo() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setFuture((f) => [cloneGrid(grid), ...f]);
    setHistory((h) => h.slice(0, -1));
    setGrid(prev);
    setRows(prev.length);
  }

  function handleRedo() {
    if (!future.length) return;
    const next = future[0];
    setHistory((h) => [...h, cloneGrid(grid)]);
    setFuture((f) => f.slice(1));
    setGrid(next);
    setRows(next.length);
  }

  function paintCell(r, c, mode) {
    setGrid((g) => {
      const next = cloneGrid(g);
      next[r][c] = mode;
      return next;
    });
  }

  function handlePointerDown(r, c) {
    pushHistory(grid);
    const mode = !grid[r][c];
    paintingRef.current = mode;
    paintCell(r, c, mode);
  }

  function handlePointerOver(r, c) {
    if (paintingRef.current === null) return;
    paintCell(r, c, paintingRef.current);
  }

  function endPainting() {
    paintingRef.current = null;
  }

  function handleHeightChange(nextRows) {
    pushHistory(grid);
    setRows(nextRows);
    setGrid((g) => {
      if (nextRows > g.length) {
        return [...cloneGrid(g), ...Array.from({ length: nextRows - g.length }, () => Array(WIDTH).fill(false))];
      }
      return cloneGrid(g).slice(0, nextRows);
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pasteReady);
      const global = await recordGlobalCopy("canvas");
      setCopyCount(global !== null ? global : recordCopy("canvas"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {}
  }

  // Named tool actions, reused by both the buttons and the keyboard.
  const handleInvert = () => doAction((g) => g.map((row) => row.map((v) => !v)));
  const handleMirror = () => doAction((g) => g.map((row) => [...row].reverse()));
  const handleShiftLeft = () => doAction((g) => g.map((row) => [...row.slice(1), false]));
  const handleShiftRight = () => doAction((g) => g.map((row) => [false, ...row.slice(0, -1)]));
  const handleClear = () => doAction(() => emptyGrid(rows));
  const handleEnlarge = () => handleHeightChange(Math.min(20, rows + 2));

  // Keyboard command system: Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or
  // Ctrl/Cmd+Y redo, Shift+ArrowLeft/Right shift the canvas, I invert,
  // M mirror, Delete clear, E enlarge. Ignored while typing in an
  // input/textarea, so sliders and other fields keep working.
  useEffect(() => {
    function onKey(e) {
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      if (mod && key === "y") {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handleShiftLeft();
        return;
      }
      if (e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleShiftRight();
        return;
      }
      if (!mod && !e.altKey && !e.shiftKey) {
        if (key === "i") { e.preventDefault(); handleInvert(); }
        else if (key === "m") { e.preventDefault(); handleMirror(); }
        else if (e.key === "Delete") { e.preventDefault(); handleClear(); }
        else if (key === "e") { e.preventDefault(); handleEnlarge(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function handlePublish() {
    if (onPublish) {
      onPublish(previewRows.join("\n"));
      setPublished(true);
      setTimeout(() => setPublished(false), 2000);
      return;
    }
    // Standalone /canvas page: save to sessionStorage and go to /arts,
    // where ArtGallery reads it and shows the published art at the top.
    try {
      const entry = {
        id: `canvas-${Date.now()}`,
        title: "Canvas art",
        category: "Canvas",
        url: "",
        art: previewRows.join("\n"),
      };
      const prev = JSON.parse(window.sessionStorage.getItem("valoart-published") || "[]");
      window.sessionStorage.setItem("valoart-published", JSON.stringify([entry, ...prev]));
    } catch {}
    setPublished(true);
    setTimeout(() => { window.location.href = "/arts"; }, 1200);
  }

  return (
    <section className="canvas-section" onPointerUp={endPainting} onPointerLeave={endPainting}>
      <div className="canvas-grid-layout">
        <div className="canvas-panel">
          <h2>Paint on a 26-column chat canvas</h2>
          <p className="lead">Every cell becomes one character in chat.</p>

          <div className="canvas-tools">
            <button type="button" onClick={handleUndo} disabled={!history.length} aria-label="Undo (Ctrl+Z)"><Undo fill="currentColor" size={15} /> Undo <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> Ctrl+Z</span></button>
            <button type="button" onClick={handleRedo} disabled={!future.length} aria-label="Redo (Ctrl+Shift+Z)"><Redo fill="currentColor" size={15} /> Redo <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> Ctrl+Shift+Z</span></button>
            <button type="button" onClick={handleInvert} aria-label="Invert (I)"><Contrast fill="currentColor" size={15} /> Invert <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> I</span></button>
            <button type="button" onClick={handleMirror} aria-label="Mirror (M)"><FlipHorizontal fill="currentColor" size={15} /> Mirror <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> M</span></button>
            <button type="button" onClick={handleShiftLeft} aria-label="Shift left (Shift+Left arrow)"><ArrowLeft fill="currentColor" size={15} /> Shift left <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> Shift+←</span></button>
            <button type="button" onClick={handleShiftRight} aria-label="Shift right (Shift+Right arrow)"><ArrowRight fill="currentColor" size={15} /> Shift right <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> Shift+→</span></button>
            <button type="button" onClick={handleClear} aria-label="Clear (Delete)"><Trash fill="currentColor" size={15} /> Clear <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> Del</span></button>
            <button type="button" onClick={handleEnlarge} aria-label="Enlarge canvas (E)"><Plus fill="currentColor" size={15} /> Enlarge canvas <span className="tool-tip"><Keyboard fill="currentColor" size={11} /> E</span></button>
          </div>

          <div className="spacing-row">
            <label className="field-label" htmlFor="canvas-height">Canvas height</label>
            <span className="spacing-value">{rows} rows</span>
          </div>
          <input
            id="canvas-height"
            type="range"
            min="3"
            max="20"
            step="1"
            value={rows}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            className="spacing-slider"
          />

          <div
            className="paint-grid"
            style={{ gridTemplateColumns: `repeat(${WIDTH}, 1fr)` }}
            onPointerLeave={endPainting}
          >
            {grid.map((row, r) =>
              row.map((filled, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  aria-label={`Cell ${r + 1},${c + 1}`}
                  className={filled ? "paint-cell filled" : "paint-cell"}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handlePointerDown(r, c);
                  }}
                  onPointerOver={() => handlePointerOver(r, c)}
                />
              ))
            )}
          </div>
          <p className="meta" style={{ marginTop: 12 }}>
            Drag with a mouse, pen, or finger to paint. Tap a filled cell to erase.
          </p>

          <div className="style-box">
            <div>
              <p className="field-label" style={{ margin: 0 }}>Customize style</p>
              <p className="meta" style={{ margin: "4px 0 0" }}>
                Background {bg === " " ? "blank" : bg} · Brush █ · {BACKGROUND_NAMES[bgIndex]}
              </p>
            </div>
            <button type="button" className="change-button" onClick={() => setBgIndex((i) => (i + 1) % BACKGROUNDS.length)}>
              Change
            </button>
          </div>
        </div>

        <div className="canvas-panel">
          <div className="preview-header">
            <div>
              <h3>Live VALORANT preview</h3>
              <p className="meta" style={{ margin: "4px 0 0" }}>
                {rows} rows · 26 wide · {totalChars} characters
              </p>
            </div>
            <span className="chat-ready">Chat ready</span>
          </div>
          <div className="preview-box">
            <pre className="preview-art">{previewRows.join("\n")}</pre>
          </div>
          <div className="preview-actions">
            <button type="button" className={copied ? "copy-ready-button is-copied" : "copy-ready-button"} onClick={handleCopy}>
              <span key={copied ? "copied" : "copy"} style={{display:"inline-flex", alignItems:"center", gap:"8px", animation:"copy-label-in 0.8s cubic-bezier(0.22, 1, 0.36, 1)"}}><Copy fill="currentColor" size={16} /> {copied ? "Copied!" : "Copy paste-ready art"}</span>
            </button>
            <button type="button" className="publish-button" onClick={handlePublish}>
              <span style={{display:"inline-flex", alignItems:"center", gap:"8px"}}><Upload fill="currentColor" size={16} /> {published ? "Published!" : "Publish"}</span>
            </button>
          </div>
          {copyCount > 0 && (
            <p className="meta" style={{ marginTop: 8 }}>
              {copyCount} {copyCount === 1 ? "copy" : "copies"} total
            </p>
          )}
        </div>
      </div>

      <style>{`
        .canvas-section { padding: 20px 0 80px; }
        .canvas-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }
        .canvas-panel {
          background: #2e2e2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 20px;
        }
        .canvas-panel h2 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #ece8e1;
          margin: 0 0 6px;
        }
        .canvas-panel h3 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #ece8e1;
          margin: 0;
        }
        .canvas-panel .lead {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          margin: 0 0 18px;
        }
        .canvas-panel .meta {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #b9bfc7;
          font-size: 14px;
        }
        .canvas-tools { display: flex; flex-wrap: wrap; gap: 8px; }
        /* Icon + text buttons, smooth: every hover/press eases, icons are
           filled-style Lucide icons (stroke 2, currentColor) with a soft
           filled button background, not just plain text. */
        .canvas-tools button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: #ece8e1;
          border: 0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
          transition: background-color 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes icon-flip { 0% { transform: perspective(500px) rotateY(0deg) scale(1); } 50% { transform: perspective(500px) rotateY(180deg) scale(1.15); } 100% { transform: perspective(500px) rotateY(360deg) scale(1); } }
        .canvas-tools button > svg, .copy-ready-button svg, .publish-button svg { will-change: transform; }
        .canvas-tools button:hover:not(:disabled) > svg { animation: icon-flip 1.4s cubic-bezier(0.65, 0, 0.35, 1); }
        .canvas-tools button:disabled { opacity: 0.4; cursor: default; }
        .canvas-tools button:hover:not(:disabled) { background: rgba(255, 255, 255, 0.16); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); }
        .canvas-tools button:active:not(:disabled) { transform: scale(0.97); }
        /* Small hover tooltips: shortcuts live here now, not in a help
           line or on the buttons themselves. They fade/slide in slowly
           and lazily (0.8s lazy ease), and fade out just as slowly. */
        .canvas-tools button { position: relative; }
        .tool-tip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #1a1a1a;
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 11px;
          font-family: 'Noto Sans Mono', monospace;
          white-space: nowrap;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          opacity: 0;
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .canvas-tools button:hover:not(:disabled) .tool-tip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .publish-button span { display: inline-flex; align-items: center; gap: 8px; }
        .publish-button { transition: background-color 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .publish-button:hover { transform: translateY(-1px); }
        .copy-ready-button:hover svg, .publish-button:hover svg { animation: icon-flip 1.4s cubic-bezier(0.65, 0, 0.35, 1); }
        .field-label {
          display: block;
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          font-size: 14px;
          margin: 16px 0 8px;
        }
        .spacing-row { display: flex; justify-content: space-between; align-items: center; }
        .spacing-value { font-family: 'Figtree', system-ui, sans-serif; color: #ece8e1; }
        .spacing-slider { width: 100%; accent-color: #ff4655; }
        .paint-grid {
          display: grid;
          gap: 2px;
          background: #242424;
          border-radius: 12px;
          padding: 12px;
          margin-top: 16px;
          touch-action: none;
          user-select: none;
        }
        .paint-cell {
          aspect-ratio: 1;
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          padding: 0;
          cursor: crosshair;
        }
        .paint-cell.filled { background: #ff4655; border-color: #ff4655; }
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
        .preview-actions { display: flex; gap: 10px; margin-top: 16px; }
        @keyframes copy-label-in {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .copy-ready-button {
          flex: 1;
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
        }
        .copy-ready-button:hover { transform: scale(1.02); }
        .copy-ready-button:active { transform: scale(0.98); }
        .copy-ready-button.is-copied { background: #22c55e; box-shadow: 0 0 24px rgba(34, 197, 94, 0.25); }
        .publish-button {
          background: rgba(255, 255, 255, 0.10);
          color: #ece8e1;
          border: 0;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
        }
        @media (max-width: 800px) {
          .canvas-grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
