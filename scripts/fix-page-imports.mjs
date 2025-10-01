import fs from "fs";

const file = "src/app/page.js";
if (!fs.existsSync(file)) {
  console.error(`❌ ${file} not found`);
  process.exit(1);
}

let src = fs.readFileSync(file, "utf8");

// 1) Ensure a single "use client" at the very top
src = src.replace(/^\uFEFF/, ""); // strip BOM
src = src.replace(/^\s*("use client";|'use client';)\s*/gi, ""); // remove existing at top
src = `"use client";\n` + src;
// remove duplicates later in file
src = src.replace(/(\r?\n)\s*("use client";|'use client';)\s*/gi, "$1");

// 2) Ensure React import includes useState, useEffect, useRef
const desiredReact = 'import React, { useState, useEffect, useRef } from "react";';
const reactImportRegex = /^import\s+[^;]*\s+from\s+["']react["'];?$/m;
if (reactImportRegex.test(src)) {
  src = src.replace(reactImportRegex, desiredReact);
} else {
  src = src.replace(/^"use client";\s*/, `"use client";\n${desiredReact}\n`);
}

// 3) Add next/navigation if useRouter is referenced
if (/\buseRouter\b/.test(src) && !/from\s+["']next\/navigation["']/.test(src)) {
  src = src.replace(/^import React[^\n]*\n/, m => m + 'import { useRouter } from "next/navigation";\n');
}

// 4) Add next-auth/react if useSession is referenced
if (/\buseSession\b/.test(src) && !/from\s+["']next-auth\/react["']/.test(src)) {
  src = src.replace(/^import React[^\n]*\n/, m => m + 'import { useSession } from "next-auth/react";\n');
}

fs.writeFileSync(file, src, "utf8");
console.log("✅ Fixed imports and 'use client' in", file);
