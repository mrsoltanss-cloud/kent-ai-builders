"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Lead = {
  id: string;
  createdAt: string | Date;
  service: string;
  scope?: string | null;
  sqm?: number | null;
  urgency: string;
  budget?: number | null;
  status: string;
  user?: { id: string; email: string; name?: string | null };
};

type Props = {
  initialItems: Lead[];
  initialTotal: number;
  initialPage: number;
  initialTake: number;
  initialQuery: string;
};

export default function LeadsClient({
  initialItems,
  initialTotal,
  initialPage,
  initialTake,
  initialQuery,
}: Props) {
  const [items, setItems] = useState<Lead[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [take] = useState(initialTake);
  const [q, setQ] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pages = Math.max(1, Math.ceil(total / take));

  const load = async (opts?: { q?: string; page?: number }) => {
    const nextQ = opts?.q ?? q;
    const nextPage = opts?.page ?? page;
    const url = new URL("/api/admin/leads", location.origin);
    if (nextQ) url.searchParams.set("q", nextQ);
    url.searchParams.set("page", String(nextPage));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load leads: ${res.status}`);
    const data = await res.json();
    setItems(data.items);
    setTotal(data.total);
    setPage(data.page);
  };

  // Optional: keep list in sync if the server props change (navigations)
  useEffect(() => {
    setItems(initialItems);
    setTotal(initialTotal);
    setPage(initialPage);
    setQ(initialQuery);
  }, [initialItems, initialTotal, initialPage, initialQuery]);

  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => selected.has(i.id)),
    [items, selected]
  );

  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) {
      items.forEach((i) => next.delete(i.id));
    } else {
      items.forEach((i) => next.add(i.id));
    }
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/leads/bulk/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Bulk delete failed");
      toast.success(`Deleted ${selected.size} lead(s)`);
      setSelected(new Set());
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Bulk delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search service or scope…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              load({ q: (e.target as HTMLInputElement).value, page: 1 });
            }
          }}
        />
        <button
          className="px-3 py-2 rounded border"
          onClick={() => load({ q, page: 1 })}
          disabled={busy}
        >
          Apply
        </button>
        <button
          className="px-3 py-2 rounded border disabled:opacity-50"
          onClick={bulkDelete}
          disabled={busy || selected.size === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 w-10">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Service</th>
              <th className="text-left p-2">Scope</th>
              <th className="text-left p-2">SQM</th>
              <th className="text-left p-2">Urgency</th>
              <th className="text-left p-2">Budget</th>
              <th className="text-left p-2">Status</th>
              <th className="p-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={() => toggleOne(l.id)}
                    aria-label={`Select ${l.id}`}
                  />
                </td>
                <td className="p-2">
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {l.user?.email ?? "—"}
                </td>
                <td className="p-2">{l.service}</td>
                <td className="p-2">{l.scope ?? "—"}</td>
                <td className="p-2">{l.sqm ?? "—"}</td>
                <td className="p-2">{l.urgency}</td>
                <td className="p-2">{l.budget ?? "—"}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setBusy(true);
                      try {
                        const res = await fetch(`/api/admin/leads/${l.id}`, {
                          method: "DELETE",
                        });
                        if (!res.ok) throw new Error("Delete failed");
                        toast.success("Lead deleted");
                        await load();
                      } catch (err: any) {
                        toast.error(err?.message ?? "Delete failed");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <button className="px-2 py-1 rounded border" disabled={busy}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={10}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {pages} • {total} total
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => load({ page: Math.max(1, page - 1) })}
            disabled={page <= 1 || busy}
          >
            Prev
          </button>
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => load({ page: Math.min(pages, page + 1) })}
            disabled={page >= pages || busy}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
