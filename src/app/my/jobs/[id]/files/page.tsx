export default function FilesPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Files for job {params.id}</h1>
      <p className="mt-2 text-neutral-600">(Stub) Upload and manage photos, drawings, quotes.</p>
    </main>
  );
}
