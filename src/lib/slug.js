// Slugs for dedicated art pages: /art/<slug>
// Slugify a title: lowercase, strip diacritics (Poké -> poke), replace
// any run of non-alphanumerics with a single hyphen, trim hyphens.
// Examples: "Choco Poop" -> choco-poop, "-20rr delivery" -> 20rr-delivery,
// "Small Heart" -> small-heart, "Don't shoot!" -> dont-shoot,
// "Bobo yarn? (Tagalog)" -> bobo-yarn-tagalog, "?" -> "" (fallback below).
export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a unique slug for every art, in gallery order. First occurrence
// gets the plain slug, later duplicates get -2, -3, etc.:
// "Nerd" (id 6) -> nerd, "Nerd" (id 29) -> nerd-2, "Cat" -> cat,
// "CAT" -> cat-2, "Skull" -> skull, "Skull" -> skull-2.
// Returns a Map from art id -> slug, with 149 unique slugs for the gallery.
export function buildSlugMap(arts) {
  const counts = {};
  const map = new Map();
  for (const art of arts) {
    const base = slugify(art.title) || `art-${art.id}`;
    counts[base] = (counts[base] || 0) + 1;
    map.set(art.id, counts[base] === 1 ? base : `${base}-${counts[base]}`);
  }
  return map;
}

export function getSlugById(slugMap, art) {
  return slugMap.get(art.id) || slugify(art.title) || `art-${art.id}`;
}
