// Pinned promo art for ruvix.lol, the site's domain. This is NOT part of
// the scrolling gallery — it is rendered as a separate pinned section at
// the top of the Arts tab, so it always stays on top, even when the user
// searches or scrolls the gallery. Copy uses the same single-space row
// join as every other card, so it pastes in one line.
// Made like the "EZ" art already in the gallery (id 28, Texts): 5 rows
// total — a dotted top row, 3 glyph rows, a dotted bottom row — using
// only block characters (█, ▀, ▄, ░) and no plain letters or spaces
// inside any row, so VALORANT wraps only at row boundaries and the art
// does not break. Glyphs are 4 wide with a 1-dotted-column gap, spelling
// RUVIX, padded to 26 wide. Paste-ready 134 chars. Card title/URL still
// promote ruvix.lol.
export const PROMO_ART = {
  id: "promo-ruvix",
  title: "Promo: ruvix.lol",
  category: "Promo",
  url: "https://ruvix.lol",
  art: "░░░░░░░░░░░░░░░░░░░░░░░░░░\n░█▀▀▀░█░░█░█░░█░████░█░░█░\n░█▀▀░░█░░█░█░░█░░██░░░██░░\n░█░░█░▀▀▀▀░░▀▀░░████░█░░█░\n░░░░░░░░░░░░░░░░░░░░░░░░░░"
};
