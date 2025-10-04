const fs = require('fs');

function patchHome(file){
  if(!fs.existsSync(file)) return false;
  let src = fs.readFileSync(file,'utf8');
  let changed = false;

  // Ensure import for HowItWorksShow
  if(!src.includes('HowItWorksShow')){
    const importLine = `import HowItWorksShow from "@/components/home/HowItWorksShow";\n`;
    const ib = src.match(/^(import .+\n)+/m);
    src = ib ? src.replace(/^(import .+\n)+/m, m => m + importLine) : importLine + src;
    changed = true;
  }

  // Remove HowItWorksEpic import if present
  if(src.includes('HowItWorksEpic')){
    src = src.replace(/import\s+HowItWorksEpic\s+from\s+["'][^"']+["'];?\n?/g, '');
    changed = true;
  }

  // Replace any <HowItWorksEpic .../> with <HowItWorksShow />
  const before = src;
  src = src.replace(/<HowItWorksEpic(\s*\/>|[^>]*>[\s\S]*?<\/HowItWorksEpic>)/g, '<HowItWorksShow />');
  if(src !== before) changed = true;

  // If neither old nor new exists in JSX, inject after first <main>
  if(!/<HowItWorksShow\s*\/>/.test(src)){
    src = src.replace(/<main\b[^>]*>/, (m) => `${m}\n  <HowItWorksShow />`);
    changed = true;
  }

  if(changed){
    fs.writeFileSync(file, src, 'utf8');
    console.log('✍️  Patched', file);
  } else {
    console.log('ℹ️  No changes needed for', file);
  }
  return true;
}

const homes = ['src/app/page.tsx','src/app/page.ts','src/app/page.jsx','src/app/page.js'];
const found = homes.some(patchHome);
if(!found) console.log('⚠️ Homepage not found; skipping.');
