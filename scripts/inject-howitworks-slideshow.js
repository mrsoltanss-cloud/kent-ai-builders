const fs = require('fs');
const files = ['src/app/page.tsx','src/app/page.ts','src/app/page.jsx','src/app/page.js'];
const file = files.find(f => fs.existsSync(f));
if(!file){ console.log('ℹ️ Homepage not found, skip.'); process.exit(0); }
let src = fs.readFileSync(file,'utf8');
if(!src.includes('HowItWorksShow')){
  const importLine = `import HowItWorksShow from "@/components/home/HowItWorksShow";\n`;
  const ib = src.match(/^(import .+\n)+/m);
  src = ib ? src.replace(/^(import .+\n)+/m, m => m + importLine) : importLine + src;
}
if(!/<HowItWorksShow\s*\/>/.test(src)){
  src = src.replace(/<main\b[^>]*>/, (m) => `${m}\n  <HowItWorksShow />`);
}
fs.writeFileSync(file, src, 'utf8');
console.log('✅ Injected HowItWorksShow into homepage (if not present).');
