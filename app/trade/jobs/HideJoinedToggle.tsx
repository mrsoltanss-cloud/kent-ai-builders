'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function HideJoinedToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const checked = params?.get?.('hideJoined') === '1';

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = new URLSearchParams(params?.toString?.() ?? "");
    if (e.currentTarget.checked) next.set('hideJoined', '1');
    else next.delete('hideJoined');
    router.push(`/trade/jobs?${next.toString()}`);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm select-none">
      <input
        type="checkbox"
        className="h-4 w-4 accent-emerald-600"
        defaultChecked={checked}
        onChange={onChange}
      />
      Hide jobs I’ve joined
    </label>
  );
}
