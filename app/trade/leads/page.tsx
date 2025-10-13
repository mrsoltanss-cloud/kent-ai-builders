export default function Page(){
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold">My Leads</h1>
        <p className="text-slate-600">Your leads will appear here (PENDING / QUOTED / CLOSED).</p>
        <div className="mt-6 rounded-2xl p-6 bg-white shadow">
          <div className="text-slate-500">Empty state • No leads yet.</div>
        </div>
      </div>
    </main>
  )
}
