import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const exts = new Set(['.tsx', '.ts', '.jsx', '.js', '.mdx', '.html']);
const BAD = 'https://brixel.uk/signup/trader';
const GOOD = '/trade/signup';

async function* walk(dir) {
  for (const d of await fs.readdir(dir, { withFileTypes: true })) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      // skip node_modules/.next/out/dist/build artefacts
      if (d.name === 'node_modules' || d.name === '.next' || d.name === 'dist' || d.name === 'build' || d.name === 'out') continue;
      yield* walk(entry);
    } else if (exts.has(path.extname(d.name))) {
      yield entry;
    }
  }
}

let changed = 0;
let touched = [];

for await (const file of walk(process.cwd())) {
  const src = await fs.readFile(file, 'utf8');
  if (src.includes(BAD)) {
    const out = src.split(BAD).join(GOOD);
    if (out !== src) {
      await fs.writeFile(file, out, 'utf8');
      changed++;
      touched.push(file);
    }
  }
}

if (changed === 0) {
  console.log('No files needed changes. ✅');
} else {
  console.log(`Updated ${changed} file(s):`);
  for (const f of touched) console.log(' -', f);
  console.log(`\nReplaced "${BAD}" → "${GOOD}"`);
}
