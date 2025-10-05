const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const exts = new Set(['.tsx', '.jsx']);
const labelRe = /Email\s+us(\s+now)?/i; // matches "Email us" and "Email us now"
const preferPathRe = /(success|thank|thanks)/i; // prefer files whose path includes these

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(p, out);
    } else {
      const ext = path.extname(entry.name);
      if (exts.has(ext)) out.push(p);
    }
  }
  return out;
}

function findCandidates() {
  const roots = [];
  if (fs.existsSync(path.join(ROOT, 'src'))) roots.push(path.join(ROOT, 'src'));
  if (fs.existsSync(path.join(ROOT, 'app'))) roots.push(path.join(ROOT, 'app'));
  if (roots.length === 0) roots.push(ROOT);

  const files = roots.flatMap(r => walk(r));
  // Rank by: contains label + preferred path
  const scored = [];
  for (const f of files) {
    let src;
    try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (!labelRe.test(src)) continue;
    const prefer = preferPathRe.test(f) ? 1 : 0;
    scored.push({ f, prefer, len: src.length });
  }
  scored.sort((a, b) => (b.prefer - a.prefer) || (a.len - b.len));
  return scored.map(s => s.f);
}

function ensureLinkImport(src) {
  if (/from\s+['"]next\/link['"]/.test(src)) return src; // already imported
  // Insert after the first import block (after last consecutive import line at top)
  const lines = src.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 50); i++) {
    if (/^\s*import\s+/.test(lines[i])) lastImportIdx = i;
    else if (lastImportIdx >= 0) break;
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, `import Link from 'next/link';`);
    return lines.join('\n');
  }
  // No imports detected at top—prepend
  return `import Link from 'next/link';\n` + src;
}

function insertAfterEmailButton(src) {
  // Find label
  const m = src.match(labelRe);
  if (!m) return null;
  const labelIdx = m.index;
  // Find closing tag after label (either </Link> or </a>)
  const closeStart = src.indexOf('</', labelIdx);
  if (closeStart === -1) return null;
  const closeEnd = src.indexOf('>', closeStart);
  if (closeEnd === -1) return null;
  const insertPos = closeEnd + 1;

  const snippet = `
<Link
  href="/my"
  className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
>
  Back to my area
</Link>`;

  return src.slice(0, insertPos) + snippet + src.slice(insertPos);
}

(function main() {
  const candidates = findCandidates();
  if (candidates.length === 0) {
    console.error('❌ Could not find a TSX/JSX file containing "Email us".');
    process.exit(2);
  }

  // Prefer success/thank paths; otherwise take first match
  const targetFile = candidates[0];
  const original = fs.readFileSync(targetFile, 'utf8');

  // Backup
  const backup = `${targetFile}.bak.${Date.now()}`;
  fs.writeFileSync(backup, original, 'utf8');

  // Ensure Link import
  let updated = ensureLinkImport(original);

  // Insert after the Email button
  updated = insertAfterEmailButton(updated);
  if (!updated) {
    console.error(`❌ Found the label but could not safely insert after it in ${targetFile}.`);
    process.exit(3);
  }

  fs.writeFileSync(targetFile, updated, 'utf8');

  console.log(`✅ Patched: ${targetFile}`);
  console.log(`🗂 Backup:  ${backup}`);
})();
