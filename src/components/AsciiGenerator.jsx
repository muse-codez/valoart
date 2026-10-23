import React from "react";
import { useMemo, useState } from "react";
import { toAscii } from "../lib/ascii.js";

export default function AsciiGenerator() {
  const [text, setText] = useState("ACE");
  const [copied, setCopied] = useState(false);
  const art = useMemo(() => toAscii(text.trim() || "ACE"), [text]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(art);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="card">
      <h2>Text ASCII Generator</h2>
      <p className="lead">Type text, get fixed-width block art for VALORANT chat.</p>
      <div className="row">
        <input
          type="text"
          value={text}
          maxLength={24}
          placeholder="Type your text, e.g. ACE"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" onClick={copy}>{copied ? "Copied!" : "Copy art"}</button>
      </div>
      <pre>{art}</pre>
      <p className="meta">{art.length} characters · 5 fixed-width rows</p>
    </section>
  );
}
