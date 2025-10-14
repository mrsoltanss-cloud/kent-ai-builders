"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function PortfolioStep({ onBack }: { onBack?: () => void }) {
  const [projects, setProjects] = useState<{ id: number; url: string; caption: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const newItems: { id: number; url: string; caption: string }[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newItems.push({
          id: Date.now() + Math.random(),
          url: reader.result as string,
          caption: "",
        });
        if (newItems.length === files.length) {
          setProjects((prev) => [...prev, ...newItems]);
          setUploading(false);
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCaption = (id: number, text: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption: text } : p))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-sky-300 hover:text-sky-100 transition"
        >
          ← Back
        </button>
        <span className="text-sky-300 text-sm">
          {projects.length} project{projects.length !== 1 && "s"} added
        </span>
      </div>

      {/* Upload zone */}
      <label
        htmlFor="upload"
        className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-sky-400/40 p-10 text-center hover:border-sky-300 transition-all bg-white/5 backdrop-blur-sm hover:bg-white/10"
      >
        {uploading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-sky-300"
          >
            Uploading…
          </motion.div>
        ) : (
          <>
            <p className="text-sky-200 font-semibold mb-1">
              Drag & Drop or Click to Upload
            </p>
            <p className="text-sky-400/70 text-sm">
              Add 1–3 photos of your recent projects
            </p>
          </>
        )}
        <input
          id="upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-xl overflow-hidden border border-sky-500/30 bg-white/5 shadow-md shadow-cyan-500/10"
            >
              <img
                src={p.url}
                alt="Project preview"
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Describe this project..."
                  value={p.caption}
                  onChange={(e) => handleCaption(p.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/40 border border-sky-500/30 text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <button
        disabled={projects.length === 0}
        onClick={() => window.location.href = "/trade/onboarding/verification"}
        className={`w-full py-3 font-semibold rounded-xl transition-all ${
          projects.length > 0
            ? "bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-900 shadow-lg shadow-cyan-500/30 hover:opacity-90"
            : "bg-white/10 text-sky-200 cursor-not-allowed"
        }`}
      >
        Continue →
      </button>
    </motion.div>
  );
}
