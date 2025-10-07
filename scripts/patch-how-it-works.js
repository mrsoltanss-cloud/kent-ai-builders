const fs = require('fs');
const path = require('path');

const candidates = ['src/app/page.tsx', 'src/app/page.ts', 'src/app/page.jsx', 'src/app/page.js'];
const file = candidates.find(f => fs.existsSync(f));
if (!file) {
  console.error('❌ Could not find homepage (src/app/page.*). Please adjust the script.');
  process.exit(1);
}
let src = fs.readFileSync(file, 'utf8');

// ensure import is present
if (!/HowItWorksEpic/.test(src)) {
  const importLine = `import HowItWorksEpic from "@/components/home/HowItWorksEpic";\n`;
  // place after first import block
  if (/^import .+$/m.test(src)) {
    src = src.replace(/^(import .+\n)+/m, (m) => m + importLine);
  } else {
    src = importLine + src;
  }
}

// replace section between headings
const startRe = /(How it works[^<\n]*<\/[^>]+>|How it works[^<\n]*\n)/i; // heading line/element
const endRe = /(Browse our most popular categories[^<\n]*<\/[^>]+>|Browse our most popular categories[^<\n]*\n)/i;

const startIdx = src.search(startRe);
const endIdx = src.search(endRe);

if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  console.error('⚠️ Could not locate the exact section by headings. No destructive change made.');
  console.error('   You can still manually place <HowItWorksEpic /> where you want on the homepage.');
} else {
  const before = src.slice(0, startIdx);
  const after = src.slice(endIdx);
  src = before + '<HowItWorksEpic />\n' + after;
  console.log('✅ Replaced old "How it works" section with <HowItWorksEpic />');
}

fs.writeFileSync(file, src, 'utf8');
console.log('✍️  Patched', file);
