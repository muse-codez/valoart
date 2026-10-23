// Gallery arts on this site — metadata only for now, with a link to the
// original Valorant Scout gallery page for each art, where the art itself
// can be viewed and copied. No other arts are listed here.
//
// When an art is supplied by the user (their own art, or one they have
// permission to use), add it here as:
//   { title, category, copies, author, url, art }
// where `art` is the multi-line string, one row per line, every row the
// same width. ArtCard previews it in <pre> exactly as written, and its
// Copy button joins the rows into one line for VALORANT chat (see ArtCard).
// The gallery loads 24 at a time and auto-loads the next 24 on scroll,
// so a list of 149 works the same way as a list of 5.
export const GALLERY_ARTS = [
  {
    title: "Choco Poop",
    category: "Funny",
    copies: "3.5K copies",
    author: "SonicOp",
    url: "https://valorantscout.com/ascii/choco-poop",
    summary: "A playful character art",
  },
  {
    title: "-20rr delivery",
    category: "Funny",
    copies: "3.3K copies",
    author: "",
    url: "https://valorantscout.com/ascii/20rr-delivery",
    summary: "A delivery joke about losing RR",
  },
  {
    title: "Middle finger",
    category: "Funny",
    copies: "3.1K copies",
    author: "",
    url: "https://valorantscout.com/ascii/middle-finger",
    summary: "A hand gesture art",
  },
  {
    title: "Middle finger 2",
    category: "Emojis",
    copies: "2.4K copies",
    author: "Slave",
    url: "https://valorantscout.com/ascii/middle-finger-2",
    summary: "A simpler hand gesture art",
  },
  {
    title: "Gorilla",
    category: "Animals",
    copies: "2.3K copies",
    author: "",
    url: "https://valorantscout.com/ascii/gorilla",
    summary: "A gorilla face art",
  },
];
