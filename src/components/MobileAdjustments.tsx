'use client';
import * as React from 'react';

/**
 * MobileAdjustments
 * Injects safe, mobile-only CSS that:
 * - stacks the hero cards cleanly
 * - tightens the matchmaking shell padding
 * - keeps the yellow toast off the header
 * Desktop remains untouched (rules are inside max-width media queries).
 */
export default function MobileAdjustments() {
  return (
    <style
      // NOTE: these classnames are non-destructive; if a page doesn't have them, no effect.
      dangerouslySetInnerHTML={{
        __html: `
@media (max-width: 1024px) {
  .hero-cards { grid-template-columns: 1fr; gap: 16px; }
  .hero-card  { min-width: auto; }
  .matchmaking-shell { padding: 12px 12px 16px; }
  .toast-fixed { bottom: 16px; }
}
@media (max-width: 640px) {
  .hero-cards { grid-auto-flow: row; overflow: visible; }
  .toast-fixed { left: 12px; right: 12px; width: auto; }
}
        `,
      }}
    />
  );
}
