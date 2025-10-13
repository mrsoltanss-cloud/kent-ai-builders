// @ts-nocheck
export default function SchedulePage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Schedule survey for job {params.id}</h1>
      <p className="mt-2 text-neutral-600">(Stub) Pick a time that suits you.</p>
    </main>
  );
}
