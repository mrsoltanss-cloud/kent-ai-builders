"use client";

export default function CopyRef({ value }: { value: string }) {
  async function copy() {
    try { await navigator.clipboard.writeText(value); } catch {}
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="px-2.5 py-1.5 text-xs rounded-lg border hover:bg-gray-100 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label="Copy reference"
    >
      Copy
    </button>
  );
}
