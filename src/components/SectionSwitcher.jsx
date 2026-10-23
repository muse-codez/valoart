import React from "react";
import { useEffect, useState } from "react";
import ArtGallery from "./ArtGallery.jsx";
import TextGen from "./TextGen.jsx";
import Canvas from "./Canvas.jsx";

// Navbar routes <-> tabs. Navbar and SectionSwitcher are separate React
// islands, so the URL hash is the bridge between them: a navbar click
// changes the hash, and SectionSwitcher listens for that change.
const TAB_FROM_HASH = {
  "#ascii": "arts",
  "#text-gen": "textgen",
  "#canvas": "canvas",
};
const HASH_FROM_TAB = {
  arts: "#ascii",
  textgen: "#text-gen",
  canvas: "#canvas",
};

// Section tabs, placed above the gallery area:
// Arts (gallery), Text Gen (banner generator), Canvas (paint canvas).
export default function SectionSwitcher() {
  const [tab, setTab] = useState("arts");
  const [published, setPublished] = useState([]);

  useEffect(() => {
    function syncFromHash() {
      const next = TAB_FROM_HASH[window.location.hash];
      if (next) {
        setTab(next);
        // All three tabs live in the same #ascii section, so scroll there
        // (the hash itself has no matching element for #text-gen/#canvas).
        document.getElementById("ascii")?.scrollIntoView({ behavior: "smooth" });
      }
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectTab(next) {
    setTab(next);
    const hash = HASH_FROM_TAB[next];
    if (hash && window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  function handlePublish(artText) {
    const entry = {
      id: `canvas-${Date.now()}`,
      title: "Canvas art",
      category: "Canvas",
      url: "",
      art: artText,
    };
    setPublished((prev) => [entry, ...prev]);
    selectTab("arts");
  }

  return (
    <div className="section-switcher">
      <div className="tab-buttons" role="tablist" aria-label="Sections">
        <button type="button" className={tab === "arts" ? "tab-button active" : "tab-button"} onClick={() => selectTab("arts")}>
          Arts
        </button>
        <button type="button" className={tab === "textgen" ? "tab-button active" : "tab-button"} onClick={() => selectTab("textgen")}>
          Text Gen
        </button>
        <button type="button" className={tab === "canvas" ? "tab-button active" : "tab-button"} onClick={() => selectTab("canvas")}>
          Canvas
        </button>
      </div>

      {tab === "arts" && <ArtGallery extraArts={published} />}
      {tab === "textgen" && <TextGen />}
      {tab === "canvas" && <Canvas onPublish={handlePublish} />}

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
      `}</style>
    </div>
  );
}
