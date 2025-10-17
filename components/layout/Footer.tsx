"use client";
import React from "react";
const AREAS_PRIMARY = ["Kent","Maidstone","Canterbury","Ashford","Medway"];
const AREAS_TOWNS = ["Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester","Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling","Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup","Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet"];
function waLink(){
  const e164=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+441474462265").replace(/^\+/,"");
  const msg="Hi — I’d like to book a site visit via Brixel. Can you send available times?";
  return `https://wa.me/${e164}?text=${encodeURIComponent(msg)}`;
}
export default function Footer(){
  const wa=waLink();
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-10 sm:py-12">
          <div className="rounded-2xl bg-emerald-700 text-emerald-50 px-6 py-8 sm:px-10 sm:py-10 shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-semibold">Ready to build smarter?</h3>
            <p className="mt-2 text-emerald-100">Kent’s only AI-powered builder. Get your instant estimate today.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/quote" className="inline-flex items-center justify-center rounded-xl bg-white text-emerald-900 px-5 py-3 text-sm font-semibold shadow hover:bg-emerald-50">Get My Instant Estimate</a>
              <a href={wa} className="inline-flex items-center justify-center rounded-xl bg-emerald-900/30 ring-1 ring-emerald-200/40 px-5 py-3 text-sm font-semibold hover:bg-emerald-900/40">Talk on WhatsApp</a>
            </div>
          </div>
        </section>
        <section className="py-8 sm:py-10 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-slate-300">Contact</h4>
              <p className="mt-3 text-slate-200">
                <a href={wa} className="underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300">Chat on WhatsApp</a>
                {" "}to book a site visit today — <span className="font-medium">we’ll send times right away</span>. This is the fastest way to get started and keep your project moving.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300">Service Areas</h4>
              <div className="mt-3 text-sm">
                <div className="flex flex-wrap gap-x-2">
                  {AREAS_PRIMARY.map((a,i)=>(
                    <span key={a} className="text-white">{a}{i<AREAS_PRIMARY.length-1?" • ":""}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm"> <div className="flex flex-wrap gap-x-2 gap-y-1"> <span className="text-white">Sevenoaks</span> <span>•</span> <span className="text-white">Swanley</span> <span>•</span> <span className="text-white">Dartford</span> <span>•</span> <span className="text-white">Gravesend</span> <span>•</span> <span className="text-white">Longfield</span> <span>•</span> <span className="text-white">New Ash Green</span> <span>•</span> <span className="text-white">Rochester</span> <span>•</span> <span className="text-white">Chatham</span> <span>•</span> <span className="text-white">Gillingham</span> <span>•</span> <span className="text-white">Strood</span> <span>•</span> <span className="text-white">Maidstone</span> <span>•</span> <span className="text-white">Aylesford</span> <span>•</span> <span className="text-white">Snodland</span> <span>•</span> <span className="text-white">West Malling</span> <span>•</span> <span className="text-white">Sittingbourne</span> <span>•</span> <span className="text-white">Tonbridge</span> <span>•</span> <span className="text-white">Royal Tunbridge Wells</span> <span>•</span> <span className="text-white">Orpington</span> <span>•</span> <span className="text-white">Bromley</span> <span>•</span> <span className="text-white">Sidcup</span> <span>•</span> <span className="text-white">Bexleyheath</span> <span>•</span> <span className="text-white">Welling</span> <span>•</span> <span className="text-white">Greenhithe</span> <span>•</span> <span className="text-white">Swanscombe</span> <span>•</span> <span className="text-white">Ebbsfleet</span> </div> </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300">Trust</h4>
              <ul className="mt-3 space-y-2 text-slate-200">
                <li>✅ Fully insured &amp; guaranteed</li>
                <li>🔒 Fair pricing, no pushy sales</li>
                <li className="text-slate-400">© Brixel {new Date().getFullYear()}</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-300">Prefer calling? WhatsApp still works best for sharing photos, plans, and getting fast appointment slots.</p>
        </section>
      </div>
    </footer>
  );
}
