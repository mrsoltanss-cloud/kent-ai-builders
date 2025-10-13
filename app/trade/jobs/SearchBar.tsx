'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

function useDebounced(fn: (...a:any[]) => void, ms = 400) {
  return useMemo(() => {
    let t: any;
    return (...a:any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  }, [fn, ms]);
}

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params?.get?.('q') ?? '';

  const apply = useCallback((val: string) => {
    const next = new URLSearchParams(params?.toString?.() ?? "");
    const v = val.trim();
    if (v) next.set('q', v);
    else next.delete('q');
    router.push(`/trade/jobs?${next.toString()}`);
  }, [params, router]);

  const onChange = useDebounced((e: React.ChangeEvent<HTMLInputElement>) => {
    apply(e.currentTarget.value);
  });

  return (
    <div className="w-full max-w-sm">
      <input
        type="text"
        placeholder="Search title, summary, postcode…"
        defaultValue={q}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}
