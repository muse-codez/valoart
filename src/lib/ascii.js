const FONT = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"], B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"], D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"], F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"], H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: [" ### ", "  #  ", "  #  ", "  #  ", " ### "], J: ["  ###", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"], L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"], N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "], P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#  # ", " ## #"], R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "], T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "], V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"], X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "], Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "], "1": ["  #  ", " ##  ", "  #  ", "  #  ", " ### "],
  "2": [" ### ", "    #", " ### ", "#    ", "#####"], "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#  # ", "#  # ", "#####", "   # ", "   # "], "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "], "7": ["#####", "   # ", "  #  ", " #   ", " #   "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "], "9": [" ### ", "#   #", " ####", "    #", " ### "],
  "-": ["     ", "     ", "#####", "     ", "     "], "+": ["     ", "  #  ", "#####", "  #  ", "     "],
  ":": ["     ", "  #  ", "     ", "  #  ", "     "], "?": [" ### ", "   # ", "  #  ", "     ", "  #  "],
  " ": ["  ", "  ", "  ", "  ", "  "], ".": [" ", " ", " ", " ", "#"], "!": ["#", "#", "#", " ", "#"],
};

export function toAscii(text) {
  const rows = ["", "", "", "", ""];
  for (const ch of text.toUpperCase().split("")) {
    const glyph = FONT[ch] || [ch + " ", ch + " ", ch + " ", ch + " ", ch + " "];
    glyph.forEach((line, i) => { rows[i] += line + " "; });
  }
  return rows.join("\n").replace(/[ \t]+$/gm, "");
}

// Banner version: `spacing` extra spaces between letters (0-3), and
// `fill` character used to pad every row to the same width, so empty
// cells survive VALORANT chat (spaces at row ends would be trimmed).
// Returns rows (array of 5 strings, all the same length) — no trailing
// trim, so the shape is preserved.
export function toBannerRows(text, spacing = 1, fill = "░") {
  const rows = ["", "", "", "", ""];
  const chars = text.toUpperCase().split("");
  chars.forEach((ch, idx) => {
    const glyph = FONT[ch] || [ch + " ", ch + " ", ch + " ", ch + " ", ch + " "];
    glyph.forEach((line, i) => { rows[i] += line; });
    if (idx < chars.length - 1) {
      const gap = " ".repeat(1 + spacing);
      rows.forEach((_, i) => { rows[i] += gap; });
    }
  });
  const width = Math.max(...rows.map((r) => r.length), 0);
  // Fill empty cells: replace trailing spaces AND internal spaces that
  // are part of the background? No — only pad to width, and replace
  // spaces that are at the end of a row with the fill character, so the
  // row keeps its full width in chat. Internal spaces stay as spaces,
  // matching the block-letter shape.
  return rows.map((r) => {
    const padded = r.padEnd(width, " ");
    // Replace trailing spaces with fill, so chat does not trim them.
    return padded.replace(/ +$/, (m) => fill.repeat(m.length));
  });
}

