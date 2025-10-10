"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TRADES = [
  { key: "", label: "All trades" },
  { key: "kitchen", label: "Kitchen" },
  { key: "fencing", label: "Fencing" },
  { key: "painting", label: "Painting" },
  { key: "bathroom", label: "Bathroom" },
  { key: "garden", label: "Gardening" },
];

export default function Filters() {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [trade, setTrade] = useState(sp.get("trade") ?? "");
  const [tier, setTier] = useState(sp.get("tier") ?? "");
  const [onlyNew, setOnlyNew] = useState(sp.get("new") === "1");
  const [min, setMin] = useState(sp.get("min") ?? "");
  const [max, setMax] = useState(sp.get("max") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "new"); // new | budget | slots

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setTrade(sp.get("trade") ?? "");
    setTier(sp.get("tier") ?? "");
    setOnlyNew(sp.get("new") === "1");
    setMin(sp.get("min") ?? "");
    setMax(sp.get("max") ?? "");
    setSort(sp.get("sort") ?? "new");
  }, [sp]);

  const push = () => {
    const u = new URL(window.location.href);
    const S = (k: string, v: string) =>
      v ? u.searchParams.set(k, v) : u.searchParams.delete(k);

    S("q", q.trim());
    S("trade", trade);
    S("tier", tier);
    S("min", min.trim());
    S("max", max.trim());
    S("sort", sort || "new");
    onlyNew ? u.searchParams.set("new", "1") : u.searchParams.delete("new");

    router.push(u.pathname + "?" + u.searchParams.toString());
  };

  const reset = () => {
    setQ(""); setTrade(""); setTier(""); setOnlyNew(false); setMin(""); setMax(""); setSort("new");
    router.push(window.location.pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title, summary, postcode…"
        className="input input-bordered w-[420px]"
      />

      <select value={trade} onChange={(e)=>setTrade(e.target.value)} className="select select-bordered">
        {TRADES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>

      <select value={tier} onChange={(e)=>setTier(e.target.value)} className="select select-bordered">
        <option value="">All tiers</option>
        <option value="STANDARD">Standard</option>
        <option value="QUICKWIN">Quick win</option>
        <option value="PRIORITY">Priority</option>
      </select>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={onlyNew} onChange={(e)=>setOnlyNew(e.target.checked)} />
        <span>New only</span>
      </label>

      <input value={min} onChange={(e)=>setMin(e.target.value)} placeholder="Min £" className="input input-bordered w-24" />
      <input value={max} onChange={(e)=>setMax(e.target.value)} placeholder="Max £" className="input input-bordered w-24" />

      {/* Sort control */}
      <select value={sort} onChange={(e)=>setSort(e.target.value)} className="select select-bordered">
        <option value="new">Newest</option>
        <option value="budget">Budget (high → low)</option>
        <option value="slots">Slots left (most → least)</option>
      </select>

      <button onClick={push} className="btn btn-primary">Search</button>
      <button onClick={reset} className="btn">Clear</button>
    </div>
  );
}
