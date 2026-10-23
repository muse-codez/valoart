import React from "react";
import { Github } from "lucide-react";

const OPTIONS = [
  { label: "Arts", href: "/arts", key: "arts" },
  { label: "Text gen", href: "/textgen", key: "textgen" },
  { label: "Canvas", href: "/canvas", key: "canvas" },
];

export default function Navbar({ active = "" }) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="brand" href="/">
        {/* Yarndings 12 icon: the letter V renders as a patterned Yarndings motif. */}
        <span className="brand-icon" aria-hidden="true">V</span>
        <span className="brand-name">ValoArt</span>
      </a>

      <div className="nav-options">
        {OPTIONS.map((opt) => (
          <a key={opt.label} className={active === opt.key ? "nav-option active" : "nav-option"} href={opt.href}>
            {opt.label}
          </a>
        ))}
      </div>

      <a
        className="github-link"
        href="https://github.com/muse-codez/valoart"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ValoArt on GitHub"
      >
        <Github size={22} strokeWidth={1.8} />
      </a>

      <style>{`
        .navbar {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: min(1080px, calc(100% - 32px));
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 18px;
          /* Floating, square with rounded edges — not a pill */
          border-radius: 16px;
          /* Transparent, but not fully blurred */
          background: rgba(52, 52, 52, 0.62);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #ece8e1;
          flex-shrink: 0;
        }
        .brand-icon {
          font-family: 'Yarndings 12', serif;
          font-size: 30px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.10);
          color: #ece8e1;
        }
        .brand-name {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 400;
          font-size: 20px;
          letter-spacing: 0.2px;
        }
        .nav-options {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nav-option {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #d8dde2;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 10px;
        }
        .nav-option:hover {
          background: rgba(255, 255, 255, 0.10);
          color: #ffffff;
        }
        .nav-option.active {
          background: rgba(255, 70, 85, 0.25);
          color: #ffffff;
        }
        .github-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          color: #ece8e1;
          text-decoration: none;
          flex-shrink: 0;
        }
        .github-link:hover {
          background: rgba(255, 255, 255, 0.10);
        }
        @media (max-width: 600px) {
          .navbar { flex-wrap: wrap; justify-content: center; }
          .brand-name { font-size: 18px; }
          .nav-option { font-size: 15px; padding: 6px 10px; }
        }
      `}</style>
    </nav>
  );
}
