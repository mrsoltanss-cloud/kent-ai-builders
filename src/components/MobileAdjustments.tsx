'use client';
import * as React from 'react';

/**
 * MobileAdjustments
 * - Finds hero cards section (“Pick Your Job”) and tags it with .hero-cards / .hero-card
 * - Finds AI sections (“AI Thinks”, “Smart Matchmaking”) and tags container with .matchmaking-shell
 * - Finds the yellow toast (fixed + yellow bg) and tags it with .toast-fixed
 * - Applies CSS tweaks only below 480px, no effect on desktop
 */
export default function MobileAdjustments() {
  React.useEffect(() => {
    const tag = () => {
      // 1) HERO CARDS (Pick Your Job)
      const pickHead = Array.from(document.querySelectorAll('h1,h2'))
        .find(el => /Pick Your Job/i.test(el.textContent || ''));
      if (pickHead) {
        const root = pickHead.closest('section,div') || document.body;
        // try to find a grid-like wrapper under this section
        const grid = (root.querySelector('.grid, [class*="grid-cols"], [class*="grid ']') as HTMLElement) ||
                     (root.querySelector('div[class*="grid"]') as HTMLElement) ||
                     undefined;
        if (grid) {
          grid.classList.add('hero-cards');
          Array.from(grid.children).forEach(ch => (ch as HTMLElement).classList.add('hero-card'));
        }
      }

      // 2) AI SECTIONS (AI Thinks / Smart Matchmaking)
      const aiHead = Array.from(document.querySelectorAll('h1,h2'))
        .find(el => /(AI Thinks|Smart Matchmaking)/i.test(el.textContent || ''));
      if (aiHead) {
        // try to find the rounded white panel that holds the visual
        const shell =
          (aiHead.parentElement?.querySelector('[class*="rounded"], [class*="ring-"], [class*="shadow"]') as HTMLElement) ||
          (aiHead.closest('section,div')?.querySelector('[class*="rounded"], [class*="ring-"], [class*="shadow"]') as HTMLElement);
        if (shell) shell.classList.add('matchmaking-shell');
      }

      // 3) YELLOW TOAST (fixed + yellow background)
      const maybeToasts = Array.from(document.querySelectorAll('.bg-yellow-50, .bg-amber-50, .bg-[#fff7cc], [role="status"]'));
      for (const el of maybeToasts) {
        const cs = window.getComputedStyle(el);
        if (cs.position === 'fixed') {
          (el as HTMLElement).classList.add('toast-fixed');
        }
      }
    };

    // tag immediately, after hydration, and on DOM changes
    tag();
    const t1 = setTimeout(tag, 300);
    const t2 = setTimeout(tag, 900);
    const mo = new MutationObserver(() => tag());
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });

    // tidy
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <style
        // mobile-only CSS; desktops unaffected
        dangerouslySetInnerHTML={{
          __html: `
@media (max-width: 480px) {
  /* Cards stack & breathe */
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

  /* AI shell padding & safe area */
  .matchmaking-shell {
    padding: 16px !important;
    border-radius: 16px !important;
    margin-inline: max(10px, env(safe-area-inset-left)) !important;
  }

  /* Keep the toast clear of the sticky header & safe area */
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
    </>
  );
}
