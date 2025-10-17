import fs from "fs";
import path from "path";

const ROOTS = ["app","components"];
const FILE_GLOB = /\.(tsx?|jsx?)$/;

const STRAY_WHATSAPP_RE = /<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g;

// Pill container (white chips) and the Kent towns array (used for mapping)
const PILL_CONTAINER_RE = /<div className="mt-4[^"]*flex[^"]*gap-2"[^>]*>[\s\S]*?<\/div>/g;
const TOWNS_ARRAY_MAP_RE = /\[\s*"Sevenoaks"[\s\S]*?"Ebbsfleet"\s*\]\.map\([\s\S]*?\)\s*/g;

// Make the crumb labels pure white (sometimes authors used /80 opacity)
const CRUMB_WEAK_WHITE_RE = /(<span className=")text-white\/\d+(">)|(<span className=")text-slate-\d+\/\d+(">)/g;

function readAllFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...readAllFiles(p));
    else if (FILE_GLOB.test(e.name)) out.push(p);
  }
  return out;
}

function dedupeMultiple(regex, s) {
  let count = 0;
  return s.replace(regex, (m) => (++count === 1 ? m : ""));
}

let changed = 0;
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of readAllFiles(root)) {
    let src = fs.readFileSync(file, "utf8");
    let orig = src;

    // 1) Remove stray WhatsApp paragraph anywhere
    src = src.replace(STRAY_WHATSAPP_RE, "");

    // 2) Only keep the first pill container per file
    src = dedupeMultiple(PILL_CONTAINER_RE, src);

    // 3) Only keep the first towns array mapping per file
    src = dedupeMultiple(TOWNS_ARRAY_MAP_RE, src);

    // 4) Strengthen crumb color to pure white
    src = src.replace(CRUMB_WEAK_WHITE_RE, (_m, a1,b1,a2,b2) => (a1 ? `${a1}text-white${b1}` : `${a2}text-white${b2}`));

    if (src !== orig) {
      fs.writeFileSync(file, src);
      console.log("✔ patched:", file);
      changed++;
    }
  }
}

if (!changed) console.log("• No changes were necessary.");
else console.log(`Done. Modified ${changed} file(s).`);
