"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { locationsData } from "@/data/locationsData";
import { servicesData } from "@/data/servicesData";

export default function LocationPage() {
  const { town } = useParams();
  const location = locationsData[town];

  if (!location) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Location Not Found</h1>
          <p className="mt-2">We don’t yet cover this area.</p>
          <Link href="/" className="text-teal-600 underline mt-4 inline-block">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-white">
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Builders in <span className="text-teal-600">{location.name}</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700">{location.intro}</p>
        </div>
      </section>

      {/* IMAGE */}
      {location.image && (
        <div className="mx-auto max-w-4xl px-6">
          <Image
            src={location.image}
            alt={`Builders in ${location.name}`}
            width={1200}
            height={600}
            className="rounded-2xl object-cover w-full"
          />
        </div>
      )}

      {/* TOP SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 text-center">
          Popular Services in {location.name}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {location.topServices.map((svc) => {
            const s = servicesData[svc];
            if (!s) return null;
            return (
              <Link
                key={svc}
                href={`/services/${svc}`}
                className="rounded-xl border p-5 hover:border-teal-500 hover:shadow-md transition"
              >
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.title}
                    width={400}
                    height={250}
                    className="rounded-lg object-cover w-full h-40"
                  />
                )}
                <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to start your project in {location.name}?
          </h2>
          <p className="mt-2 text-gray-600">
            Get your free instant estimate today, backed by our AI-powered pricing.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600"
            >
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
