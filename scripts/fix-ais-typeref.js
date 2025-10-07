const fs=require('fs'), path=require('path');
const file='src/components/home/AiShowcase.tsx';
if(!fs.existsSync(file)){ console.error('❌ Not found:', file); process.exit(1); }
let src=fs.readFileSync(file,'utf8');

// 1) Fix useRef with no initial value
// Match patterns like: useRef<number|undefined>();
src = src.replace(/useRef\s*<\s*number\s*\|\s*undefined\s*>\s*\(\s*\)/g, 'useRef<number | undefined>(undefined)');

// Also handle common variant: useRef<number>();
src = src.replace(/useRef\s*<\s*number\s*>\s*\(\s*\)/g, 'useRef<number | undefined>(undefined)');

// 2) Remove unused ESLint disable for react-hooks/exhaustive-deps (optional tidy)
src = src.replace(/\/\/\s*eslint-disable-next-line\s+react-hooks\/exhaustive-deps\s*\n/g, '');

fs.writeFileSync(file, src, 'utf8');
console.log('✅ Patched', file);
