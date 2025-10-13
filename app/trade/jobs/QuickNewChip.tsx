"use client";
import { useRouter, useSearchParams } from "next/navigation";
export default function QuickNewChip() {
  const sp = useSearchParams();
  const router = useRouter();
  const active = sp?.get?.("new") === "1";

  const toggle = () => {
    const u = new URL(window.location.href);
    if (active) u.searchParams.delete("new");
    else u.searchParams.set("new", "1");
    router.push(u.pathname + "?" + u.searchParams.toString());
  };

  return (
    <button
      onClick={toggle}
      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline"}`}
      aria-pressed={active}
      title="Show only jobs with 0 introductions"
    >
      NEW only
    </button>
  );
}
