// Pinned promo art for ruvix.lol, the site's domain. This is NOT part of
// the scrolling gallery — it is rendered as a separate pinned section at
// the top of the Arts tab, so it always stays on top, even when the user
// searches or scrolls the gallery. Copy uses the same single-space row
// join as every other card, so it pastes in one line.
// Proper promoting design (user asked for a good, proper promo after
// rejecting both the custom RUVIX banner and the ANSI Shadow RUVIX art,
// which was only "RUVIX" and 37 wide): a clean bordered badge, 7 rows
// x 26 wide, paste-ready 188 chars. It says the brand, the domain, and
// what it is — VALOART / ruvix.lol / CHAT ARTS — in plain readable text
// centred on a dotted background with a solid border, so anyone who sees
// it pasted in VALORANT chat instantly knows what site to visit. No
// multi-space padding (only single spaces inside the text), so VALORANT
// does not strip the layout; padding is the dotted background glyph.
export const PROMO_ART = {
  id: "promo-ruvix",
  title: "Promo \u2014 ruvix.lol",
  category: "Promo",
  url: "https://ruvix.lol",
  art: "██████████████████████████\n█░░░░░░░░░░░░░░░░░░░░░░░░█\n█░░░░░░░░VALOART░░░░░░░░░█\n█░░░░░░░ruvix.lol░░░░░░░░█\n█░░░░░░░CHAT ARTS░░░░░░░░█\n█░░░░░░░░░░░░░░░░░░░░░░░░█\n██████████████████████████"
};
