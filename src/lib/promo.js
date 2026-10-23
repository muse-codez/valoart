// Pinned promo art for ruvix.lol, the site's domain. This is NOT part of
// the scrolling gallery — it is rendered as a separate pinned section at
// the top of the Arts tab, so it always stays on top, even when the user
// searches or scrolls the gallery. Copy uses the same single-space row
// join as every other card, so it pastes in one line.
// REDESIGN 2026-10-23: the previous bordered badge broke in VALORANT
// because it used plain narrow letters (VALOART / ruvix.lol / CHAT ARTS)
// with internal spaces — VALORANT fits several narrow rows on one chat
// line and wraps inside rows, so the box fell apart. This version uses
// ONLY block characters (█, ░, ▀, ▄) and NO spaces inside any row, exactly
// like the other gallery arts: each row is a solid 26-wide block word, so
// VALORANT wraps only at the single-space row separators, at row
// boundaries. Design: 3-high block-letter RUVIX on top, a dotted
// separator row, then .LOL below — together reading ruvix.lol. 7 rows
// x 26 wide, paste-ready 188 chars.
export const PROMO_ART = {
  id: "promo-ruvix",
  title: "Promo \u2014 ruvix.lol",
  category: "Promo",
  url: "https://ruvix.lol",
  art: "░░░███░█░█░█░█░░█░░█░█░░░░\n░░░██░░█░█░▀▄▀░░█░░░█░░░░░\n░░░█░█░▀▀▀░░▀░░░█░░█░█░░░░\n░░░░░░░░░░░░░░░░░░░░░░░░░░\n░░░░░░░░░█░░░▄▀▄░█░░░░░░░░\n░░░░░░░░░█░░░█░█░█░░░░░░░░\n░░░░░░█░░███░▀▄▀░███░░░░░░"
};
