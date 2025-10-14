export default function Page(){
  return (
    <main className="min-h-[100dvh] bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6">
        <header className="rounded-2xl p-6 bg-white shadow flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Trade Profile</h1>
            <p className="text-slate-600">Edit your company details, services, coverage, portfolio, and trust badges.</p>
          </div>
          <div className="badge badge-warning">Draft</div>
        </header>
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-white shadow">
            <h2 className="font-semibold">Company & Contact</h2>
            <p className="text-slate-600">Placeholder fields. We’ll wire forms after schema lands.</p>
          </div>
          <div className="rounded-2xl p-6 bg-white shadow">
            <h2 className="font-semibold">Public Preview</h2>
            <div className="mt-3 h-48 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700"></div>
          </div>
        </section>
      </div>
    </main>
  )
}
