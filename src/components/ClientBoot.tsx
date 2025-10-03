"use client";

import { useEffect } from "react";

/**
 * Remove oversized emoji icons next to known feature labels and center their text.
 * Works on hydration & route changes via a MutationObserver.
 */
export default function ClientBoot() {
  useEffect(() => {
    const LABELS = [
      "handshake",
      "guaranteed",
      "team on site",
      "verified",
    ];

    const hasEmoji = (s: string) => {
      try {
        return /\p{Extended_Pictographic}/u.test(s);
      } catch {
        return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(s);
      }
    };

    const hideIconAndCenter = (root: ParentNode | Document) => {
      const all = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, div, span, p"));
      for (const el of all) {
        const txt = (el.textContent || "").trim().toLowerCase();
        if (!txt) continue;
        if (!LABELS.includes(txt)) continue;

        // Center the tile/card that holds this label
        const card = (el.closest("div,section,article,li") as HTMLElement) ?? el.parentElement;
        if (card) {
          card.style.textAlign = "center";
          card.style.display = card.style.display || "flex";
          card.style.flexDirection = "column";
          card.style.alignItems = "center";
          card.style.justifyContent = card.style.justifyContent || "center";

          // Hide any sibling that looks like a big emoji
          const kids = Array.from(card.children) as HTMLElement[];
          for (const kid of kids) {
            if (kid === el) continue;
            const fs = parseFloat(getComputedStyle(kid).fontSize || "0");
            const text = (kid.textContent || "").trim();
            if ((fs >= 28 && hasEmoji(text)) || hasEmoji(text) && text.length <= 3) {
              kid.style.display = "none";
            }
          }
        }
      }
    };

    // Run immediately
    hideIconAndCenter(document);

    // Watch future updates (hydration / route changes)
    const obs = new MutationObserver((mut) => {
      for (const m of mut) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) hideIconAndCenter(n as Element);
          });
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => obs.disconnect();
  }, []);

  return null;
}
