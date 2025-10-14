"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountStep({ onComplete }: { onComplete?: () => void }) {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
        flashSaved();
      };
      reader.readAsDataURL(file);
    }
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ready = company && email && password;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Logo Upload */}
      <div className="flex flex-col items-center">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center hover:border-cyan-400 transition">
            {logo ? (
              <img src={logo} alt="Logo" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <span className="text-sky-300 text-3xl">📸</span>
            )}
          </div>
        </label>
        <p className="text-sm text-sky-300 mt-2">Upload your company logo</p>
      </div>

      {/* Inputs */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 1 },
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="space-y-4"
      >
        {[
          { label: "Company Name", value: company, set: setCompany, type: "text" },
          { label: "Contact Email", value: email, set: setEmail, type: "email" },
          { label: "Password", value: password, set: setPassword, type: "password" },
        ].map((f) => (
          <motion.div
            key={f.label}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <label className="block text-sky-300 text-sm mb-1">{f.label}</label>
            <input
              type={f.type}
              value={f.value}
              onChange={(e) => {
                f.set(e.target.value);
                flashSaved();
              }}
              placeholder={`Enter ${f.label.toLowerCase()}`}
              className="w-full p-3 rounded-xl bg-white/10 border border-sky-500/20 text-white placeholder-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Continue */}
      <button
        disabled={!ready}
        onClick={onComplete}
        className={`w-full py-3 font-semibold rounded-xl transition-all ${
          ready
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30 hover:opacity-90"
            : "bg-white/10 text-sky-200 cursor-not-allowed"
        }`}
      >
        Continue to next step →
      </button>

      {/* Saved Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-sky-600/90 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            Saved ✓
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
