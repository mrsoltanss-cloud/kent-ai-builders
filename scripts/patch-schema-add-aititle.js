const fs = require('fs');
const p = 'prisma/schema.prisma';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('aiTitle')) {
  console.log('Schema already has aiTitle fields — skipping.');
  process.exit(0);
}

const insert = `
  /// ---- AI title cache (hybrid) ----
  aiTitle       String?
  aiTitleAt     DateTime?
  aiTitleModel  String?
  aiTitleHash   String?
`;

const re = /model\s+Job\s*\{([\s\S]*?)\n\}/m;
const m = s.match(re);
if (!m) throw new Error("Couldn't find `model Job { ... }` in prisma/schema.prisma");

const before = m[0];
const updated = before.replace('{', '{' + insert);
s = s.replace(before, updated);

fs.writeFileSync(p, s, 'utf8');
console.log('Added aiTitle fields to Job.');
