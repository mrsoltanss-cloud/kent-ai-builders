import fs from "fs";
import path from "path";

function cleanWhatsAppLine(text) {
  // Remove any stray <p>…Chat on WhatsApp to book a site visit today…</p>
  return text.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");
}

function dedupePillBlocksInFooter(text) {
  // Work ONLY inside the last <footer>…</footer> (the visible one)
  const start = text.lastIndexOf("<footer");
  const end   = text.indexOf("</footer>", start);
  if (start === -1 || end === -1) return text;

  const before = text.slice(0, start);
  const footer = text.slice(start, end + "</footer>".length);
  const after  = text.slice(end + "</footer>".length);

  // Inside this footer, keep ONLY the first town pills container:
  // <div className="mt-4 flex flex-wrap gap-2"> … </div>
  const pillRe = /<div className="mt-4[^"]*flex[^"]*gap-2"[^>]*>[\s\S]*?<\/div>/g;
  let i = 0;
  const fixed = footer.replace(pillRe, (m) => (++i === 1 ? m : ""));

  // Also guard against a second JS array/map block for towns (keep the first)
  const townArrayRe = /\[\s*"Sevenoaks"[\s\S]*?"Ebbsfleet"\s*\]\.map\([\s\S]*?\)\s*/g;
  i = 0;
  const fixed2 = fixed.replace(townArrayRe, (m) => (++i === 1 ? m : ""));

  return before + fixed2 + after;
}

function processFile(file) {
  if (!fs.existsSync(file)) return false;
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  s = cleanWhatsAppLine(s);
  if (path.basename(file) === "page.js" && file.includes(path.join("app","page.js"))) {
    s = dedupePillBlocksInFooter(s);
  }
  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log("✔ patched:", file);
    return true;
  } else {
    console.log("• no change:", file);
    return false;
  }
}

let changed = false;
changed |= processFile("app/page.js");

// Also clean the WhatsApp stray line if it exists anywhere in UI helpers
const candidates = [
  "components/ui/GlobalFocusHomeowners.tsx",
  "components/layout/Footer.tsx",
];
for (const f of candidates) changed |= processFile(f);

if (!changed) {
  console.log("No modifications were necessary.");
} else {
  console.log("Done.");
}
