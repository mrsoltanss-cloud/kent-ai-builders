"use client";

import { useEffect } from "react";

/**
 * Hides duplicate trust panels by keeping the first heading match and hiding later ones.
 * Matches:
 *  - "Why ... homeowners ... choose Brixel"
 *  - "Why homeowners trust us"
 */
export default function DedupTrustPanels() {
  useEffect(() => {
    try {
      const isMatch = (el: Element) => {
        const txt = (el.textContent || "").trim();
        return (
          /Why[\s\S]{0,120}?homeowners[\s\S]{0,120}?choose\s+Brixel/i.test(txt) ||
          /Why\s+homeowners\s+trust\s+us/i.test(txt)
        );
      };

      const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
      let seen = false;

      headings.forEach((h) => {
        if (!isMatch(h)) return;
        if (!seen) {
          seen = true; // keep the first one
          return;
        }
        // Hide the nearest wrapper
        const wrapper = (h.closest("section") || h.closest("div")) as HTMLElement | null;
        if (wrapper) {
          wrapper.style.display = "none";
          wrapper.setAttribute("data-dedup-hidden", "true");
        }
      });
    } catch {}
  }, []);

  return null;
}
