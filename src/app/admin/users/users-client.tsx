"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type UserRow = {
  id: string;
  email: string;
  name?: string | null;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  blockedAt?: string | Date | null;
  blockedReason?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: { leads: number };
};

type Props = {
  initialItems: UserRow[];
  initialTotal: number;
  initialPage: number;
  initialTake: number;
  initialQuery: string;
};

export default function UsersClient({
  initialItems,
  initialTotal,
  initialPage,
  initialTake,
  initialQuery,
}: Props) {
  const [items, setItems] = useState<UserRow[]>(initialItems);
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
    const url = new URL("/api/admin/users", location.origin);
    if (nextQ) url.searchParams.set("q", nextQ);
    url.searchParams.set("page", String(nextPage));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
    const data = await res.json();
    setItems(data.items);
    setTotal(data.total);
    setPage(data.page);
  };

  // Sync from server props if they change
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
    if (allChecked) items.forEach((i) => next.delete(i.id));
    else items.forEach((i) => next.add(i.id));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkBlock = async (block: boolean) => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users/bulk/block", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), block }),
      });
      if (!res.ok) throw new Error("Bulk block/unblock failed");
      toast.success(`${block ? "Blocked" : "Unblocked"} ${selected.size} user(s)`);
      setSelected(new Set());
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Bulk action failed");
    } finally {
      setBusy(false);
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users/bulk/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Bulk delete failed");
      toast.success(`Deleted ${selected.size} user(s)`);
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
          placeholder="Search email or name…"
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
          onClick={() => bulkBlock(true)}
          disabled={busy || selected.size === 0}
        >
          Block Selected
        </button>
        <button
          className="px-3 py-2 rounded border disabled:opacity-50"
          onClick={() => bulkBlock(false)}
          disabled={busy || selected.size === 0}
        >
          Unblock Selected
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
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Blocked</th>
              <th className="text-left p-2">Leads</th>
              <th className="p-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(u.id)}
                    onChange={() => toggleOne(u.id)}
                    aria-label={`Select ${u.email}`}
                  />
                </td>
                <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name ?? "—"}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.isBlocked ? "Yes" : "No"}</td>
                <td className="p-2">{u._count?.leads ?? 0}</td>
                <td className="p-2">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setBusy(true);
                      try {
                        const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
                        if (!res.ok) throw new Error("Delete failed");
                        toast.success("User deleted");
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
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No users found.
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
