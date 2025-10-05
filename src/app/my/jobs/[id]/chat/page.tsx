export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Messages for job {params.id}</h1>
      <p className="mt-2 text-neutral-600">(Stub) Conversation with your matched builder.</p>
    </main>
  );
}
