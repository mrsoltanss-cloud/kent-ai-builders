import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}

let s = fs.readFileSync(FILE, "utf8");

/* A) Remove the stray duplicate line at the very bottom (outside footer) */
s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

/* B) Work ONLY inside the last <footer>…</footer> */
const fStart = s.lastIndexOf("<footer");
const fEnd = s.indexOf("</footer>", fStart);
if (fStart === -1 || fEnd === -1) {
  console.error("❌ Could not find a <footer>…</footer> block.");
  process.exit(1);
}
const before = s.slice(0, fStart);
let footer = s.slice(fStart, fEnd + "</footer>".length);
const after = s.slice(fEnd + "</footer>".length);

/* C) Locate the Service Areas pills container:
      first <div className="mt-4 …"> after the text 'Service Areas' */
const svcIdx = footer.indexOf("Service Areas");
if (svcIdx === -1) {
  console.error("❌ 'Service Areas' not found in footer.");
  process.exit(1);
}

const startMarker = '<div className="mt-4';
let pillStart = footer.indexOf(startMarker, svcIdx);
if (pillStart === -1) {
  console.error("⚠️ Pills container not found (mt-4). No change made.");
} else {
  // Walk to matching </div> for that container (handles nested divs)
  const findClosingDiv = (html, startIdx) => {
    const open = /<div\b/gi;
    const close = /<\/div>/gi;
    open.lastIndex = startIdx + 1;
    close.lastIndex = startIdx + 1;
    let depth = 1;
    while (true) {
      const nOpen = open.exec(html);
      const nClose = close.exec(html);
      if (!nClose) return -1;
      if (!nOpen || nClose.index < nOpen.index) {
        depth--;
        if (depth === 0) return nClose.index + "</div>".length;
      } else {
        depth++;
      }
    }
  };

  const pillEnd = findClosingDiv(footer, pillStart);
  if (pillEnd === -1) {
    console.error("❌ Could not find the end of the pills container.");
  } else {
    // Build plain bullet list to match crumb style
    const towns = [
      "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester",
      "Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling",
      "Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup",
      "Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
    ];
    const plainList =
      `<div className="mt-4 text-sm">
         <div className="flex flex-wrap gap-x-2 gap-y-1">
           ${towns.map((t,i)=>`<span className="text-white">${t}</span>${i<towns.length-1?' <span>•</span> ':''}`).join("")}
         </div>
       </div>`.replace(/\n\s+/g," ").trim();

    footer = footer.slice(0, pillStart) + plainList + footer.slice(pillEnd);
  }
}

/* D) Ensure the main crumb ('Kent • Maidstone • …') uses pure white, not faded */
footer = footer.replace(
  /(<span className=")text-[^"]+(">Kent|">Maidstone|">Canterbury|">Ashford|">Medway)/g,
  (_m,a,b)=>`${a}text-white${b}`
);

/* E) Write back */
fs.writeFileSync(FILE, before + footer + after);
console.log("✅ Pills removed (now plain bullet list) and rogue WhatsApp line cleaned.");
