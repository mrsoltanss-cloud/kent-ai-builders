type Props = { params: Promise<{ slug: string }> }
export default async function Page({ params }: Props){
  const { slug } = await params
  return (
    <main className="min-h-[100dvh] bg-white">
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto p-10">
          <h1 className="text-3xl font-bold">{slug.replace(/-/g,' ')}</h1>
          <p className="text-slate-300">Verified Trade Profile</p>
          <div className="mt-6 flex gap-3">
            <a href="/quote" className="btn btn-primary">Get a Quote</a>
            <a href="#" className="btn btn-outline">WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-10 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 bg-white shadow">
            <h2 className="font-semibold">Portfolio</h2>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="aspect-video rounded-lg bg-slate-100"></div>
              <div className="aspect-video rounded-lg bg-slate-100"></div>
              <div className="aspect-video rounded-lg bg-slate-100"></div>
            </div>
          </div>
          <div className="rounded-2xl p-6 bg-white shadow">
            <h2 className="font-semibold">Services & Pricing</h2>
            <ul className="mt-3 list-disc pl-6 text-slate-700">
              <li>Bathrooms — from £3,000</li>
              <li>Kitchens — from £6,000</li>
              <li>Extensions — from £20,000</li>
            </ul>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl p-6 bg-white shadow">
            <h3 className="font-semibold">Areas Covered</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="badge">Canterbury</span>
              <span className="badge">Maidstone</span>
              <span className="badge">Ashford</span>
            </div>
          </div>
          <div className="rounded-2xl p-6 bg-white shadow">
            <h3 className="font-semibold">Trust & Verification</h3>
            <div className="mt-2 flex gap-2">
              <span className="badge badge-warning">Insurance</span>
              <span className="badge">NICEIC</span>
              <span className="badge">Gas Safe</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
