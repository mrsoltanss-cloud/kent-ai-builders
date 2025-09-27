"use client";

import Image from "next/image";
import { servicesData } from "@/data/servicesData";

export default function ServicePage({ params }) {
  const service = params.service;

  // Pull the right service data or fallback
  const data = servicesData[service] || {
    title: "Service Not Found",
    description: "We couldn’t find this service. Please go back to our services list.",
    image: "/images/default.jpg",
    costRange: "",
    faqs: [],
    reviews: [],
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative bg-gray-50 border-b">
        <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-teal-600">
              {data.title}
            </h1>
            <p className="mt-4 text-lg text-gray-700">{data.description}</p>
            {data.costRange && (
              <p className="mt-3 text-md font-semibold text-gray-800">
                Typical cost range:{" "}
                <span className="text-teal-600">{data.costRange}</span>
              </p>
            )}
            <div className="mt-6 flex gap-4">
              <a
                href="/quote"
                className="rounded-lg bg-teal-600 text-white px-5 py-3 font-semibold hover:bg-teal-700"
              >
                Get My Instant Estimate
              </a>
              <a
                href="https://wa.me/447000000000"
                className="rounded-lg border border-teal-600 text-teal-600 px-5 py-3 font-semibold hover:bg-teal-50"
              >
                Talk on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {data.reviews?.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
            What homeowners say
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.reviews.map((quote, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 hover:border-teal-500"
              >
                <div className="text-yellow-500">★★★★★</div>
                <p className="mt-2 text-gray-700">{quote}</p>
                <p className="mt-2 text-sm text-gray-500">— Verified homeowner</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faqs?.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {data.faqs.map((f, i) => (
              <div key={i} className="rounded-lg border p-4 hover:border-teal-500">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="text-gray-600 mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
