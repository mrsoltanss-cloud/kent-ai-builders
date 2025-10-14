import fs from "fs";
import path from "path";

const SEARCH_DIRS = ["app", "components"];
const EXTS = new Set([".tsx", ".jsx", ".ts", ".js"]);
const results = [];

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else if (EXTS.has(path.extname(d.name))) yield p;
  }
}

// Detect typical header/nav files first
const candidates = [];
for (const dir of SEARCH_DIRS) for (const f of walk(dir)) candidates.push(f);

// Only consider files that reference /auth/signin (likely header/nav)
const targets = candidates.filter((f) => {
  const src = fs.readFileSync(f, "utf8");
  return /href=["']\/auth\/signin["']/.test(src) && /<nav|Navigation|Header|Navbar|SiteHeader/i.test(src);
});

const uniqueTargets = targets.length ? targets : candidates.filter((f) => {
  const src = fs.readFileSync(f, "utf8");
  return /href=["']\/auth\/signin["']/.test(src);
});

let changed = 0;

for (const file of uniqueTargets) {
  let src = fs.readFileSync(file, "utf8");
  const before = src;

  // Ensure Link import if JSX uses Link
  const ensureLinkImport = () => {
    if (!/from\s+['"]next\/link['"]/.test(src)) {
      const m = src.match(/^(import[\s\S]*?;)/m);
      if (m) src = src.replace(m[0], `${m[0]}\nimport Link from "next/link";`);
      else src = `import Link from "next/link";\n` + src;
    }
  };

  // Strategy A: If existing Sign in is a <Link>, insert sibling <Link> right after it
  if (src.includes('<Link') && /href=["']\/auth\/signin["']/.test(src)) {
    ensureLinkImport();
    src = src.replace(
      /(<Link[^>]*href=["']\/auth\/signin["'][^>]*>[\s\S]*?<\/Link>)/,
      `$1
<Link href="/trade/signin" className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition">
  Trade sign in
</Link>`
    );
  } else {
    // Strategy B: anchor tag variant
    src = src.replace(
      /(<a[^>]*href=["']\/auth\/signin["'][^>]*>[\s\S]*?<\/a>)/,
      `$1
<a href="/trade/signin" className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition">
  Trade sign in
</a>`
    );
  }

  if (src !== before) {
    fs.writeFileSync(file + ".bak." + Date.now(), before, "utf8");
    fs.writeFileSync(file, src, "utf8");
    console.log("✓ Updated:", file);
    results.push(file);
    changed++;
    // stop after first header match to avoid duplicating in multiple files
    break;
  }
}

if (!changed) {
  console.log("No header with /auth/signin found to patch automatically.");
  console.log('Try: git grep -n "href=\\"/auth/signin\\"" to locate the header file.');
} else {
  console.log("\nPatched files:", results);
}
