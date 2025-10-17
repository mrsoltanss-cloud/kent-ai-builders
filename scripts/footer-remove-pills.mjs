import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}

let s = fs.readFileSync(FILE, "utf8");

/* A) Remove any stray duplicate bottom line */
s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

/* B) Work inside the LAST footer on the page */
const fStart = s.lastIndexOf("<footer");
const fEnd = s.indexOf("</footer>", fStart);
if (fStart === -1 || fEnd === -1) {
  console.error("❌ Could not find <footer>…</footer> in app/page.js");
  process.exit(1);
}
const before = s.slice(0, fStart);
let footer = s.slice(fStart, fEnd + "</footer>".length);
const after = s.slice(fEnd + "</footer>".length);

/* C) Find the Service Areas section, then the FIRST <div className="mt-4 ..."> after it (this is the pills container) */
const svcIdx = footer.indexOf("Service Areas");
if (svcIdx === -1) {
  console.error("❌ Could not find 'Service Areas' in footer.");
  process.exit(1);
}

const pillMarker = '<div className="mt-4';
const pillStart = footer.indexOf(pillMarker, svcIdx);
if (pillStart === -1) {
  console.error("⚠️ Pills container not found after 'Service Areas'. No change made.");
  fs.writeFileSync(FILE, before + footer + after);
  process.exit(0);
}

/* D) Walk to the matching closing </div> of that container (handles nested <div>s) */
function findClosingDiv(html, startIdx) {
  const openTag = /<div\b/gi;
  const closeTag = /<\/div>/gi;
  openTag.lastIndex = startIdx;
  closeTag.lastIndex = startIdx;

  let depth = 0;
  let nextOpen = openTag.exec(html);
  let nextClose = closeTag.exec(html);

  // We know the very first char at startIdx starts a <div>, so set depth=1 and advance
  depth = 1;

  while (true) {
    nextOpen = openTag.exec(html);
    // reset closeTag pointer to continue after previous match
    // (RegExp instances keep state via lastIndex)
    // nextClose is advanced automatically in loop

    const nextCloseNow = closeTag.exec(html);

    // Decide which comes first: nextOpen or nextCloseNow
    if (!nextCloseNow) return -1; // malformed
    if (!nextOpen || nextCloseNow.index < nextOpen.index) {
      // we hit a closing tag first
      depth -= 1;
      if (depth === 0) {
        return nextCloseNow.index + "</div>".length;
      }
      // continue
    } else {
      // another open before the close
      depth += 1;
      // continue
    }
  }
}

const pillEnd = findClosingDiv(footer, pillStart);
if (pillEnd === -1) {
  console.error("❌ Could not match closing </div> for pills container.");
  process.exit(1);
}

/* E) Build a plain bullet list (same style/font/colour as the crumb line) */
const towns = [
  "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester",
  "Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling",
  "Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup",
  "Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
];

const plainList = `
  <div className="mt-4 text-sm">
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      ${towns
        .map((t, i) => {
          const sep = i < towns.length - 1 ? '<span> • </span>' : '';
          return `<span className="text-white">${t}</span>${sep}`;
        })
        .join("")}
    </div>
  </div>
`.replace(/\n\s+/g, " ").trim();

/* F) Replace pills container with the plain list */
footer = footer.slice(0, pillStart) + plainList + footer.slice(pillEnd);

/* G) Also ensure the main crumb line (Kent • Maidstone • …) uses pure white, not faded */
footer = footer.replace(
  /(<span className=")text-[^"]+(">Kent|">Maidstone|">Canterbury|">Ashford|">Medway)/g,
  (_m, a, b) => `${a}text-white${b}`
);

fs.writeFileSync(FILE, before + footer + after);
console.log("✅ Pills removed and replaced with a plain bullet list matching the first 5 towns.");
