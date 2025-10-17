import fs from "fs";

const TARGETS = ["app/page.js", "components/layout/Footer.tsx"];

// Plain bullet list matching the crumb style
const towns = [
  "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester",
  "Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling",
  "Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup",
  "Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
];
const PLAIN_LIST =
  `<div className="mt-4 text-sm">
     <div className="flex flex-wrap gap-x-2 gap-y-1">
       ${towns.map((t,i)=>`<span className="text-white">${t}</span>${i<towns.length-1?' <span>•</span> ':''}`).join("")}
     </div>
   </div>`.replace(/\n\s+/g," ").trim();

// Utility: replace first pill container after "Service Areas"
function replacePills(html) {
  const svcIdx = html.indexOf("Service Areas");
  if (svcIdx === -1) return html;

  // find the pill container: the first <div className="mt-4 ..."> after 'Service Areas'
  const startMarker = '<div className="mt-4';
  const start = html.indexOf(startMarker, svcIdx);
  if (start === -1) return html;

  // walk to matching </div> (handles nesting)
  const end = findClosingDiv(html, start);
  if (end === -1) return html;

  // replace the whole container with the plain list
  return html.slice(0, start) + PLAIN_LIST + html.slice(end);
}

function findClosingDiv(src, startIdx) {
  const open = /<div\b/gi;
  const close = /<\/div>/gi;
  open.lastIndex = startIdx + 1;
  close.lastIndex = startIdx + 1;

  let depth = 1;
  while (true) {
    const nOpen = open.exec(src);
    const nClose = close.exec(src);
    if (!nClose) return -1;
    if (!nOpen || nClose.index < nOpen.index) {
      depth--;
      if (depth === 0) return nClose.index + "</div>".length;
    } else {
      depth++;
    }
  }
}

function cleanFile(path) {
  if (!fs.existsSync(path)) return false;
  let s = fs.readFileSync(path, "utf8");
  const orig = s;

  // A) Remove any stray WhatsApp duplicate paragraph
  s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

  // B) In files that actually render the footer, replace pills with plain list
  if (/Service Areas/.test(s)) {
    s = replacePills(s);
    // Ensure primary crumb is pure white (no faded classes)
    s = s.replace(
      /(<span className=")text-[^"]+(">Kent|">Maidstone|">Canterbury|">Ashford|">Medway)/g,
      (_m,a,b)=>`${a}text-white${b}`
    );
  }

  if (s !== orig) {
    fs.writeFileSync(path, s);
    console.log("✔ patched:", path);
    return true;
  } else {
    console.log("• no change:", path);
    return false;
  }
}

let changed = false;
for (const f of TARGETS) changed = cleanFile(f) || changed;

if (!changed) {
  console.log("No modifications were necessary. If pills persist, they may be rendered from another file.");
}
