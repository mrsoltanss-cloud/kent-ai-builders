'use client';
import * as React from 'react';

/**
 * MobileAdjustments
 * Auto-tags sections at runtime and applies mobile-only polish.
 * - Stacks the "Pick Your Job" cards nicely on phones
 * - Pads the AI/smart-match shell
 * - Pushes the yellow toast below the sticky header
 * Desktop is unaffected (all CSS inside max-width: 480px).
 */
export default function MobileAdjustments() {
  React.useEffect(() => {
    const tag = () => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>('h1,h2,h3'));

      // 1) HERO CARDS (Pick Your Job)
      const pickHead = headings.find(el => /Pick Your Job/i.test(el.textContent || ''));
      if (pickHead) {
        const root = pickHead.closest('section,div,main') || document.body;
        // find a descendant that is actually a grid container with multiple children
        const grid = Array.from(root.querySelectorAll<HTMLElement>('div,section,ul'))
          .find(el => getComputedStyle(el).display.includes('grid') && el.children.length >= 2);
        if (grid) {
          grid.classList.add('hero-cards');
          Array.from(grid.children).forEach(ch => (ch as HTMLElement).classList.add('hero-card'));
        }
      }

      // 2) AI SECTIONS (AI Thinks / Smart Matchmaking)
      const aiHead = headings.find(el => /(AI Thinks|Smart Matchmaking)/i.test(el.textContent || ''));
      if (aiHead) {
        const scope = aiHead.closest('section,div,main') || document.body;
        const shell = scope.querySelector<HTMLElement>(
          '[class*="rounded"],[class*="ring-"],[class*="shadow"],[class*="border"],[class*="bg-white"]'
        );
        if (shell) shell.classList.add('matchmaking-shell');
      }

      // 3) YELLOW TOAST (fixed + yellow-ish)
      const candidateToasts = Array.from(
        document.querySelectorAll<HTMLElement>('.bg-yellow-50,.bg-amber-50,[role="status"]')
      );
      for (const el of candidateToasts) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') el.classList.add('toast-fixed');
      }
    };

    // Initial + a couple of delayed passes (SSR/hydration) and watch DOM changes
    tag();
    const t1 = window.setTimeout(tag, 300);
    const t2 = window.setTimeout(tag, 900);
    const mo = new MutationObserver(tag);
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      mo.disconnect();
    };
  }, []);

  return (
    <style
      // Mobile-only tweaks; desktop untouched
      dangerouslySetInnerHTML={{
        __html: `
@media (max-width: 480px) {
  .hero-cards {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }
  .hero-card {
    min-width: 0 !important;
    border-radius: 14px !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.06) !important;
    overflow: hidden;
  }
  .matchmaking-shell {
    padding: 16px !important;
    border-radius: 16px !important;
    margin-inline: max(10px, env(safe-area-inset-left)) !important;
  }
  .toast-fixed {
    top: calc(env(safe-area-inset-top) + 64px) !important;
    left: max(10px, env(safe-area-inset-left)) !important;
    right: max(10px, env(safe-area-inset-right)) !important;
    border-radius: 14px !important;
  }
}
        `.trim()
      }}
    />
  );
}
