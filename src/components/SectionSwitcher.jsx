import React from "react";
import { useState } from "react";
import ArtGallery from "./ArtGallery.jsx";
import TextGen from "./TextGen.jsx";

// Section tabs, placed above the gallery area:
// Arts (gallery), Text Gen (banner generator), Canvas (coming soon).
export default function SectionSwitcher() {
  const [tab, setTab] = useState("arts");

  return (
    <div className="section-switcher">
      <div className="tab-buttons" role="tablist" aria-label="Sections">
        <button type="button" className={tab === "arts" ? "tab-button active" : "tab-button"} onClick={() => setTab("arts")}>
          Arts
        </button>
        <button type="button" className={tab === "textgen" ? "tab-button active" : "tab-button"} onClick={() => setTab("textgen")}>
          Text Gen
        </button>
        <button type="button" className={tab === "canvas" ? "tab-button active" : "tab-button"} onClick={() => setTab("canvas")}>
          Canvas
        </button>
      </div>

      {tab === "arts" && <ArtGallery />}
      {tab === "textgen" && <TextGen />}
      {tab === "canvas" && (
        <section className="canvas-placeholder">
          <h2>Canvas</h2>
          <p className="lead">Canvas drawing studio — coming soon.</p>
        </section>
      )}

      <style>{`
        .tab-buttons { display: flex; gap: 10px; flex-wrap: wrap; margin: 10px 0 6px; }
        .tab-button {
          background: rgba(255, 255, 255, 0.08);
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 10px 20px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Figtree', system-ui, sans-serif;
          cursor: pointer;
        }
        .tab-button.active { background: #ff4655; border-color: #ff4655; color: #fff; }
        .canvas-placeholder { padding: 20px 0 80px; }
        .canvas-placeholder h2 {
          font-family: 'Outfit', system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 4vw, 40px);
          color: #ece8e1;
          margin: 0 0 8px;
        }
        .canvas-placeholder .lead {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
