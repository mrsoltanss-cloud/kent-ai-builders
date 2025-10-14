"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingSuccess() {
  const router = useRouter();

  useEffect(() => {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.7 } });
    const timer = setTimeout(() => {
      router.push("/trade/profile");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-10 max-w-md w-full shadow-[0_0_40px_rgba(250,204,21,0.1)]"
      >
        <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-amber-300 mb-2">Welcome aboard!</h1>
        <p className="text-slate-300 text-sm mb-6">
          Your builder profile is now live and ready to impress homeowners.
        </p>

        <div className="space-y-2">
          <p className="text-slate-400 text-xs">Redirecting you to your dashboard…</p>
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      <footer className="mt-12 text-xs text-slate-500">
        © 2025 Brixel — Building the Future of Trades
      </footer>
    </main>
  );
}
