import React from "react";
import { Github } from "lucide-react";

// Site footer, rendered on every page via the shared Layout.
// Static only — no client JS needed, so Layout renders it without client:load.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="footer-logo" href="/">
            <span className="footer-icon" aria-hidden="true">V</span>
            <span>ValoArt</span>
          </a>
          <p>Valorant chat ASCII arts, made for VALORANT chat.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/arts">Arts</a>
          <a href="/textgen">Text Gen</a>
          <a href="/canvas">Canvas</a>
        </nav>

        <div className="footer-right">
          <a
            className="footer-github"
            href="https://github.com/muse-codez/valoart"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ValoArt on GitHub"
          >
            <Github size={20} strokeWidth={1.8} />
          </a>
          <a className="footer-domain" href="https://ruvix.lol" target="_blank" rel="noopener noreferrer">
            ruvix.lol
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ValoArt · Made for VALORANT chat</p>
      </div>

      <style>{`
        .site-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          margin-top: 20px;
          padding: 32px 0 24px;
          color: #d8dde2;
        }
        .footer-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: flex-start;
          justify-content: space-between;
        }
        .footer-brand p {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 14px;
          color: #b9bfc7;
          margin: 10px 0 0;
          max-width: 280px;
          line-height: 1.6;
        }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #ece8e1;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 20px;
        }
        .footer-icon {
          font-family: 'Yarndings 12', serif;
          font-size: 26px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.10);
          color: #ece8e1;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          align-items: center;
        }
        .footer-links a {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #d8dde2;
          text-decoration: none;
          font-size: 15px;
          padding: 6px 0;
        }
        .footer-links a:hover { color: #ffffff; text-decoration: underline; }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .footer-github {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          color: #ece8e1;
          text-decoration: none;
        }
        .footer-github:hover { background: rgba(255, 255, 255, 0.10); }
        .footer-domain {
          font-family: 'Figtree', system-ui, sans-serif;
          color: #ff8a93;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
        }
        .footer-domain:hover { text-decoration: underline; }
        .footer-bottom {
          max-width: 1080px;
          margin: 24px auto 0;
          padding: 0 20px;
        }
        .footer-bottom p {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 13px;
          color: #b9bfc7;
          margin: 0;
        }
        @media (max-width: 600px) {
          .footer-inner { flex-direction: column; }
        }
      `}</style>
    </footer>
  );
}
