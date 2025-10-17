import fs from "fs";

const file = "app/page.js";
if (!fs.existsSync(file)) {
  console.error("app/page.js not found.");
  process.exit(1);
}
let s = fs.readFileSync(file, "utf8");

// 2.1 Import Footer if not present
if (!s.includes('components/layout/Footer')) {
  s = s.replace(/(from ['"]react['"];?)/, `$1\nimport Footer from "@/components/layout/Footer";`);
}

// 2.2 Replace the contact block (phone/email) with WhatsApp-first paragraph
s = s.replace(
  /<h4 className="[^"]*">Contact<\/h4>[\s\S]*?<div[^>]*>\s*<\/div>|<h4 className="[^"]*">Contact<\/h4>[\s\S]*?(?=<\/div>\s*<\/div>)/,
  `
  <h4 className="text-sm font-semibold text-slate-300">Contact</h4>
  <p className="mt-3 text-slate-200">
    <a href={\`https://wa.me/\${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+441474462265").replace(/^\\+/,"")}?text=\${encodeURIComponent("Hi — I’d like to book a site visit via Brixel. Can you send available times?")}\`} className="underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300">
      Chat on WhatsApp
    </a>{" "}
    to book a site visit today — <span className="font-medium">we’ll send times right away</span>. This is the fastest way to get started and keep your project moving.
  </p>
`
);

// 2.3 Strengthen “Service Areas” primary line color (to white)
s = s.replace(
  /(>Service Areas<\/h4>[\s\S]*?<div className="mt-3[^"]*">[\s\S]*?)(className="[^"]*?text-[^"]+")(>Kent)/,
  `$1className="text-white"$3`
);

// 2.4 Upgrade pill styles near “Service Areas”
// Find up to ~120 lines after "Service Areas" and replace town pill classNames to white-on-dark.
s = s.replace(
  /(>Service Areas<\/h4>[\s\S]{0,1200}?)(<div className="mt-4[\s\S]*?<\/div>)/,
  (m, head, block) => {
    const fixed = block.replace(/className="([^"]*?)"/g, (mm, cls) => {
      // If it looks like a pill (rounded + px-? + py-?), force our readable classes
      if (/rounded/.test(cls) && /(px-|py-)/.test(cls)) {
        return `className="rounded-full bg-white text-slate-900 px-3 py-1 text-xs sm:text-sm shadow-sm ring-1 ring-slate-200 hover:bg-emerald-50"`;
      }
      return mm;
    });
    return head + fixed;
  }
);

// 2.5 As a safety net: if we still have a phone string, append our Footer and hide the inline one via a wrapper class
if (/07000 000000|hello@brixel\.uk/.test(s)) {
  if (!s.includes("<Footer />")) s += `\n\n{/* Injected reusable footer */}\n<Footer />\n`;
}

// Write back
fs.writeFileSync(file, s);
console.log("Footer patch applied to app/page.js");
