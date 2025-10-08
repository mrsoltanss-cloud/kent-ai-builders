"use client";
import * as React from "react";

export default function Drawer({
  open, onClose, title, children, width = 520,
}: { open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; width?: number; }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform`}
        style={{ width, transform: open ? "translateX(0)" : `translateX(${width}px)` }}
        aria-modal="true" role="dialog"
      >
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-base font-semibold">{title}</div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-gray-50">✕</button>
        </header>
        <div className="h-[calc(100%-56px)] overflow-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}
