export default function TrustSidebar() {
  const items = [
    "2,300+ successful projects",
    "4.9/5 rating",
    "£5m Public Liability cover",
    "12-month workmanship guarantee",
    "Verified & DBS-checked teams",
  ];
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="font-bold text-gray-900">Why homeowners choose us</h3>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span className="mt-0.5">✔️</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
