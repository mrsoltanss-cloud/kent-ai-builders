"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import Empty from "@/components/Empty";

export default function UsersClient({
  initialItems,
  initialTotal,
  initialPage,
  initialTake,
  initialQuery,
}: {
  initialItems: any[];
  initialTotal: number;
  initialPage: number;
  initialTake: number;
  initialQuery: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allChecked = useMemo(
    () => items.length > 0 && selected.size === items.length,
    [items, selected]
  );
  const anyChecked = useMemo(() => selected.size > 0, [selected]);

  return (
    <table className="w-full border rounded">
      <thead>
        <tr>
          <th className="p-2 border-b">
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = !allChecked && anyChecked;
              }}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  setSelected(new Set(items.map((u) => u.id)));
                } else {
                  setSelected(new Set());
                }
              }}
            />
          </th>
          <th className="p-2 border-b text-left">Email</th>
          <th className="p-2 border-b text-left">Name</th>
          <th className="p-2 border-b text-left">Role</th>
        </tr>
      </thead>
      <tbody>
        {items.map((u) => (
          <tr key={u.id}>
            <td className="p-2 border-b">
              <input
                type="checkbox"
                checked={selected.has(u.id)}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.currentTarget.checked) next.add(u.id);
                  else next.delete(u.id);
                  setSelected(next);
                }}
              />
            </td>
            <td className="p-2 border-b">{u.email}</td>
            <td className="p-2 border-b">{u.name ?? ""}</td>
            <td className="p-2 border-b">{u.role}</td>
          </tr>
        ))}

        {!items.length && (
          <tr>
            <td colSpan={4} className="p-0">
              <Empty title="No users found" hint="Try a different search or clear filters." />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
