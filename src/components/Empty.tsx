export default function Empty({ title="Nothing here", hint }: { title?: string; hint?: string }) {
  return (
    <div className="border rounded p-8 text-center text-gray-600">
      <div className="text-lg font-medium mb-1">{title}</div>
      {hint ? <div className="text-sm text-gray-500">{hint}</div> : null}
    </div>
  );
}
