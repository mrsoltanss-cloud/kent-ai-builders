'use client';
import * as React from 'react';

const isPhone = () => typeof window !== 'undefined' && window.innerWidth <= 768;

function addClass(el: Element | null, cls: string) {
  if (el && !el.classList.contains(cls)) el.classList.add(cls);
}

// Try to locate a container below a heading that matches text
function findSectionByHeading(text: string): HTMLElement | null {
  const nodes = Array.from(document.querySelectorAll('h1,h2,h3'));
  const target = nodes.find(n => n.textContent?.trim().toLowerCase() === text.toLowerCase());
  if (!target) return null;
  // climb up to a reasonable container
  let sec: HTMLElement | null = target.closest('section,div,main,article') as HTMLElement | null;
  return sec;
}

export default function MobileAdjustments() {
  React.useEffect(() => {
    if (!isPhone()) return;

    // 1) Pick Your Job -> first child container with multiple cards
    const jobSec = findSectionByHeading('Pick Your Job');
    if (jobSec) {
      // guess the cards row: a direct child that has >=3 children
      const row = Array.from(jobSec.querySelectorAll(':scope > div, :scope section, :scope article'))
        .find((el) => el.children && el.children.length >= 3) as HTMLElement | undefined;
      if (row) addClass(row, 'brixel-cards');
      // strap (the small grey line) if present
      const strap = jobSec.querySelector('p, small, .text-sm, .text-gray-500');
      if (strap) addClass(strap as Element, 'brixel-strap');
    }

    // 2) Smart Matchmaking -> stack chips
    const matchSec = findSectionByHeading('Smart Matchmaking');
    if (matchSec) {
      // find a container that has many "chip-ish" children
      const blocks = Array.from(matchSec.querySelectorAll(':scope .brixel-matching, :scope > div, :scope section, :scope article')) as HTMLElement[];
      let applied = false;
      for (const b of blocks) {
        if (b.children && b.children.length >= 3) {
          addClass(b, 'brixel-matching');
          // decorate children
          Array.from(b.children).forEach((c) => addClass(c, 'brixel-chip'));
          applied = true;
        }
      }
      if (!applied) {
        // fallback: apply to the largest child group
        const group = Array.from(matchSec.querySelectorAll(':scope *')).reduce<HTMLElement | null>((best, el: Element) => {
          const he = el as HTMLElement;
          if (!best || he.children.length > best.children.length) return he;
          return best;
        }, null);
        if (group && group.children.length >= 3) {
          addClass(group, 'brixel-matching');
          Array.from(group.children).forEach((c) => addClass(c, 'brixel-chip'));
        }
      }
    }

    // 3) Move the yellow “just booked” toast to bottom
    // heuristic: find a wide banner with “just booked”
    const toasts = Array.from(document.querySelectorAll('div,section,aside'))
      .filter(el => /just booked/i.test(el.textContent || '') && (el.clientHeight < 140));
    if (toasts[0]) addClass(toasts[0], 'brixel-toast-bottom');

  }, []);

  return null;
}
