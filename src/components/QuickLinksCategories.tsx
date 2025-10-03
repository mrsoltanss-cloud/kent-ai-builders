import Link from "next/link";

export default function QuickLinksCategories() {
  const items = [
    { emoji: "⚡", label: "Electrician", href: "/quote?service=electrician" },
    { emoji: "🏠", label: "Roofer", href: "/quote?service=roofer" },
    { emoji: "👷", label: "Builder", href: "/quote?service=builder" },
    { emoji: "🪴", label: "Gardener", href: "/quote?service=gardener" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 mt-4">
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">{it.emoji}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
