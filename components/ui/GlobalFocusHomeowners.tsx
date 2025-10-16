"use client";
import React, { useEffect } from "react";
import { waLink, normaliseToE164 } from "@/lib/wa";

const TOWNS = [
  "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green",
  "Rochester","Chatham","Gillingham","Strood",
  "Maidstone","Aylesford","Snodland","West Malling","Sittingbourne",
  "Tonbridge","Royal Tunbridge Wells",
  "Orpington","Bromley","Sidcup","Bexleyheath","Welling",
  "Greenhithe","Swanscombe","Ebbsfleet"
];

export default function GlobalFocusHomeowners() {
  useEffect(() => {
    const flag = process.env.NEXT_PUBLIC_FOCUS_HOMEOWNERS_V1 === "1";
    if (!flag) return;

    const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "01474462265";
    const link = waLink(raw);

    // 1) Fix every WhatsApp CTA
    document.querySelectorAll('a, button').forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      const href = (el as HTMLAnchorElement).getAttribute?.("href") || "";
      const isWA = href.includes("wa.me") || text.includes("whatsapp");
      if (isWA) {
        (el as HTMLAnchorElement).setAttribute?.("href", link);
        (el as HTMLAnchorElement).setAttribute?.("target", "_blank");
        (el as HTMLAnchorElement).setAttribute?.("rel", "noopener");
      }
      if (href.startsWith("tel:")) {
        (el as HTMLAnchorElement).setAttribute("href", link);
      }
    });

    // 2) Hide top navigation items
    const hideSelectors = [
      'a[href*="/trade/signup"]','a[href*="/trade/signin"]',
      'a[href*="/auth/signin"]','a[href*="/auth/signup"]',
      'button[aria-label="Log in"]','a[aria-label="Log in"]'
    ];
    hideSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => { (el as HTMLElement).style.display = "none"; });
    });
    Array.from(document.querySelectorAll('nav a, header a')).forEach((a) => {
      const t = (a.textContent || "").trim().toLowerCase();
      if (["brixel","homeowner","trades","trade sign up","log in","trade sign in"].includes(t)) {
        (a as HTMLElement).style.display = "none";
      }
    });

    // 3) Footer: swap Contact to WhatsApp + add Service Areas
    const footer = document.querySelector("footer") || document.querySelector('[data-footer]');
    if (footer) {
      footer.querySelectorAll('a[href^="tel:"], .phone, .tel').forEach(n => (n as HTMLElement).remove());
      if (!footer.querySelector(".wa-contact-line")) {
        const p = document.createElement("p");
        p.className = "wa-contact-line mt-2";
        const e164 = normaliseToE164(raw);
        p.innerHTML = `Chat on <a href="${link}" target="_blank" rel="noopener" class="underline decoration-emerald-600 underline-offset-2 font-medium">WhatsApp</a> to book a site visit today (we’ll send times right away).`;
        footer.appendChild(p);
      }
      const serviceHeader = Array.from(footer.querySelectorAll("h3,h4,strong,span"))
        .find(el => /service areas/i.test(el.textContent || ""));
      let listHost = serviceHeader ? serviceHeader.parentElement : null;
      if (listHost && !listHost.querySelector(".service-areas-pills")) {
        const div = document.createElement("div");
        div.className = "service-areas-pills mt-2 flex flex-wrap gap-2";
        TOWNS.forEach(town => {
          const s = document.createElement("span");
          s.className = "rounded-full bg-neutral-100 border border-neutral-200 px-2 py-1 text-sm";
          s.textContent = town;
          div.appendChild(s);
        });
        listHost.appendChild(div);
      }
    }

    // 4) Hero effect (no image dependency)
    if (!document.querySelector(".hero-effect")) {
      const hero = Array.from(document.querySelectorAll("h1"))
        .find(h => /build smarter\. faster\. fairer\./i.test(h.textContent || ""))
        ?.closest("section,div") as HTMLElement | undefined;
      const host = hero || document.querySelector('[data-hero]') || document.querySelector('main > section') as HTMLElement | null;
      if (host) host.classList.add("hero-effect");
    }
  }, []);

  return null;
}
