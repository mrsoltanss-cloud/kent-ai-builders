"use client";

export default function AdminError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div className="border p-6 rounded bg-red-50">
      <h2 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h2>
      <pre className="text-xs text-red-800 overflow-auto whitespace-pre-wrap">{String(error?.message ?? error)}</pre>
      <button onClick={reset} className="mt-3 px-3 py-2 rounded border bg-white">
        Try again
      </button>
    </div>
  );
}
