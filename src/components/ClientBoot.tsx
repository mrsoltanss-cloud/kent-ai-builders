"use client";

import { useEffect } from "react";

/**
 * Hides "big emoji-only" elements (e.g., 🤝 ✅ etc. rendered at very large sizes)
 * and centers the text in their parent container so cards look clean.
 */
export default function ClientBoot() {
  useEffect(() => {
    const isEmojiOnly = (t: string | null | undefined) => {
      if (!t) return false;
      const s = t.trim();
      if (!s) return false;
      // Treat as emoji-only if all graphemes are pictographic (covers most emoji)
      // and there are no letters/digits.
      try {
        const re = /\p{Extended_Pictographic}/u;
        // Split into Unicode code points
        const chars = Array.from(s);
        return chars.every((ch) => re.test(ch));
      } catch {
        // Fallback: simple range hits most emoji
        return /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]+$/u.test(s);
      }
    };

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>("h1, h2, h3, div, span")
    );

    for (const el of candidates) {
      const txt = el.textContent;
      const fs = parseFloat(getComputedStyle(el).fontSize || "0");
      // Consider "big" ≥ 40px
      if (fs >= 40 && isEmojiOnly(txt)) {
        el.style.display = "none";
        const parent = el.parentElement as HTMLElement | null;
        if (parent) {
          parent.style.textAlign = "center";
          // Also tidy extra spacing that was meant for the icon
          parent.style.alignItems = "center";
          parent.style.justifyContent = "center";
        }
      }
    }
  }, []);

  return null;
}
