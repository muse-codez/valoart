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

export const CHAT_ARTS = [
  { title: "-20 RR PLANE", cat: "Funny", author: "TheBigSea" },
  { title: "-20rr", cat: "Texts", author: "" },
  { title: "-20rr delivery", cat: "Funny", author: "" },
  { title: "-20RR Train", cat: "Funny", author: "" },
  { title: "-30 RR", cat: "Texts", author: "Zartex#6738" },
  { title: ":3", cat: "Cute", author: "Destan" },
  { title: ":P", cat: "Emojis", author: "" },
  { title: "?", cat: "Texts", author: "" },
  { title: "+10rr", cat: "Texts", author: "Krypto" },
  { title: "+5HP", cat: "Emojis", author: "LuzPoder" },
  { title: "1-tap", cat: "Texts", author: "kurama#ego" },
  { title: "13-0", cat: "Other", author: "" },
  { title: "1MORE", cat: "Texts", author: "" },
  { title: "200", cat: "Texts", author: "kurama#ego" },
  { title: "36 rr", cat: "Texts", author: "adu" },
  { title: "67", cat: "Funny", author: "zorty#dm" },
  { title: "9-3 curse", cat: "Texts", author: "pixsxl" },
  { title: "Ace", cat: "Texts", author: "" },
  { title: "ACE STOLEN", cat: "Texts", author: "Nola" },
  { title: "AFK", cat: "Texts", author: "" },
  { title: "ALPHA", cat: "Cute", author: "Pizzabot3001" },
  { title: "Among Us", cat: "Funny", author: "Calvin" },
  { title: "Average Ranked Mate", cat: "Funny", author: "" },
  { title: "Banhammer", cat: "Funny", author: "Blako" },
];
