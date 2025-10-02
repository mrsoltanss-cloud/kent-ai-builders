"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Phone,
  Camera,
  ShieldCheck,
  Star,
  ArrowUpRight,
} from "lucide-react";
import ConfettiOnce from "@/components/ConfettiOnce";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  refId: string;
  whatsappNumber?: string; // E.164 without plus, e.g. "447000000000"
};

export default function SuccessClient({
  refId,
  whatsappNumber = "447000000000",
}: Props) {
  // Keep WA text short & actionable (helps CTR)
  const waText = useMemo(
    () =>
      `Quote reference ${refId}.
I’ve just requested an instant estimate on Brixel.
Here are photos/details of the job:`,
    [refId]
  );

  // Simple motion helpers
  const fadeIn = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
  const stagger = {
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Celebration (respects reduced motion, fires once) */}
      <ConfettiOnce />

      {/* Top confirmation "hero" card */}
      <motion.section
        className="rounded-3xl border bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-700" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Thanks — we’ve got your request
              <span className="ml-2 align-middle">✅</span>
            </h1>
            <p className="mt-2 text-slate-600">
              Reference:{" "}
              <span className="font-mono text-sm rounded-md bg-slate-100 px-2 py-1">
                {refId}
              </span>
            </p>
          </div>
        </div>

        {/* What happens next */}
        <motion.div
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={fadeIn}
            className="rounded-2xl border p-4 bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-700" />
              <h3 className="font-medium">We assign a specialist</h3>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Usually within a few hours (always &lt; 24h).
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="rounded-2xl border p-4 bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-700" />
              <h3 className="font-medium">They’ll contact you</h3>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              To confirm scope, timings, and next steps.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="rounded-2xl border p-4 bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-slate-700" />
              <h3 className="font-medium">Speed things up</h3>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Share photos now for a faster, more accurate quote.
            </p>
          </motion.div>
        </motion.div>

        {/* Primary / secondary CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <WhatsAppButton
              phone={whatsappNumber}
              text={waText}
              className="text-base px-5 py-3 shadow-sm"
            />
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="tel:+447000000000"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-slate-50 text-slate-800"
          >
            <Phone className="h-4 w-4" />
            Call us now
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-slate-500"
          >
            Tip: include close-ups, measurements, and access constraints.
          </motion.div>
        </div>
      </motion.section>

      {/* Trust & social proof row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 bg-white shadow-sm"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <h3 className="font-medium">Trusted in Kent</h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Vetted, insured, and reviewed trades. Your details stay private.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 bg-white shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium">What homeowners say</h3>
          </div>
          <blockquote className="text-sm text-slate-700 mt-1 italic">
            “Fast, professional, and fairly priced.”
          </blockquote>
          <p className="text-xs text-slate-500 mt-1">— Jane, Maidstone</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 bg-emerald-50 shadow-sm"
        >
          <p className="text-sm text-emerald-900">
            <strong>3 similar jobs</strong> completed last week in Kent. We’ll bring that
            experience to your project.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-emerald-800 hover:underline text-sm mt-2"
          >
            See recent projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* “What you can do now” helper */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Make first contact smoother</h2>
        <ul className="list-disc pl-5 mt-2 text-slate-700 space-y-1 text-sm">
          <li>Tell us your preferred contact times (morning/afternoon).</li>
          <li>Note any parking or access constraints.</li>
          <li>Have rough dimensions ready (photos with tape measure help).</li>
        </ul>
      </motion.section>
    </div>
  );
}
