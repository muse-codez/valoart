import React from "react";
import { useRef, useState } from "react";

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
  const [published, setPublished] = useState(false);
  const paintingRef = useRef(null); // true = painting, false = erasing, null = not painting

  const bg = BACKGROUNDS[bgIndex];
  const previewRows = gridToRows(grid, bg);
  const totalChars = previewRows.join("\n").length;
  const pasteReady = previewRows.join("");

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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function handlePublish() {
    if (onPublish) {
      onPublish(previewRows.join("\n"));
      setPublished(true);
      setTimeout(() => setPublished(false), 2000);
    }
  }

  return (
    <section className="canvas-section" onPointerUp={endPainting} onPointerLeave={endPainting}>
      <div className="canvas-grid-layout">
        <div className="canvas-panel">
          <h2>Paint on a 26-column chat canvas</h2>
          <p className="lead">Every cell becomes one character in chat.</p>

          <div className="canvas-tools">
            <button type="button" onClick={handleUndo} disabled={!history.length}>Undo</button>
            <button type="button" onClick={handleRedo} disabled={!future.length}>Redo</button>
            <button type="button" onClick={() => doAction((g) => g.map((row) => row.map((v) => !v)))}>Invert</button>
            <button type="button" onClick={() => doAction((g) => g.map((row) => [...row].reverse()))}>Mirror</button>
            <button type="button" onClick={() => doAction((g) => g.map((row) => [...row.slice(1), false]))}>← Shift left</button>
            <button type="button" onClick={() => doAction((g) => g.map((row) => [false, ...row.slice(0, -1)]))}>Shift right →</button>
            <button type="button" onClick={() => doAction(() => emptyGrid(rows))}>Clear</button>
            <button type="button" onClick={() => handleHeightChange(Math.min(20, rows + 2))}>Enlarge canvas</button>
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
            <button type="button" className="copy-ready-button" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy paste-ready art"}
            </button>
            <button type="button" className="publish-button" onClick={handlePublish}>
              {published ? "Published!" : "Publish"}
            </button>
          </div>
          <p className="meta" style={{ marginTop: 12 }}>
            We fill empty cells and join the rows so the shape survives VALORANT chat. Copy here, then press Ctrl+V in game.
          </p>
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
        .canvas-tools button {
          background: rgba(255, 255, 255, 0.08);
          color: #ece8e1;
          border: 0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
        }
        .canvas-tools button:disabled { opacity: 0.4; cursor: default; }
        .canvas-tools button:hover:not(:disabled) { background: rgba(255, 255, 255, 0.16); }
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
        .copy-ready-button {
          flex: 1;
          background: #ff4655;
          color: #fff;
          border: 0;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
        }
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
