import React from "react";

// Reusable search bar — used by the gallery section.
// Props: value (string), onChange (new value), placeholder (string, optional).
export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="searchbar">
      <input
        type="text"
        className="searchbar-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <style>{`
        .searchbar { display: flex; gap: 10px; }
        .searchbar-input {
          flex: 1;
          background: #2e2e2e;
          color: #ece8e1;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 16px;
          font-family: 'Figtree', system-ui, sans-serif;
        }
        .searchbar-input::placeholder { color: #9aa0a8; }
      `}</style>
    </div>
  );
}
