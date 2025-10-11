import fs from "fs";
import path from "path";

const root = process.cwd();
const quoteDir = path.join(root, "src/app/quote");
const formFiles: string[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (f.endsWith(".tsx") || f.endsWith(".jsx")) formFiles.push(full);
  }
}

walk(quoteDir);

for (const file of formFiles) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("name=\"_company\"") || src.includes("name=\"company\"")) {
    console.log("✅ Honeypot already exists in", file);
    continue;
  }

  if (!src.includes("<form")) continue;

  const updated = src.replace(
    /<form([^>]*)>/,
    `<form$1>\n      {/* Honeypot field for spam bots */}\n      <input type="text" name="_company" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />`
  );

  fs.writeFileSync(file, updated);
  console.log("✅ Added honeypot to", file);
}
