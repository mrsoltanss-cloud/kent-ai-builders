"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

export default function CoverageStep({ onBack }: { onBack?: () => void }) {
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState(10);
  const [coords, setCoords] = useState<[number, number]>([51.505, -0.09]); // Default: London
  const [ready, setReady] = useState(false);

  // Simulate postcode lookup
  useEffect(() => {
    if (!postcode) return;
    const timeout = setTimeout(() => {
      // Simple fake geocode for UX preview
      const baseLat = 51.505 + Math.random() * 0.05 - 0.025;
      const baseLng = -0.09 + Math.random() * 0.05 - 0.025;
      setCoords([baseLat, baseLng]);
      setReady(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [postcode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
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
          Radius: {radius.toFixed(1)} mi
        </span>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter your business postcode..."
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-sky-500/30 text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
        <button
          disabled={!postcode}
          className={`px-5 rounded-xl font-semibold ${
            postcode
              ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-900 hover:opacity-90"
              : "bg-white/10 text-sky-300 cursor-not-allowed"
          }`}
          onClick={() => setReady(true)}
        >
          Locate
        </button>
      </div>

      {/* Slider */}
      <div className="pt-2">
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-sky-500/30 shadow-lg shadow-cyan-500/20">
        {ready ? (
          <MapContainer
            center={coords}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: "360px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords} />
            <Circle
              center={coords}
              radius={radius * 1609} // miles → meters
              pathOptions={{
                color: "#0ea5e9",
                fillColor: "#0ea5e9",
                fillOpacity: 0.15,
              }}
            />
          </MapContainer>
        ) : (
          <div className="h-[360px] flex flex-col items-center justify-center text-sky-400/80">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-2"
            >
              📍
            </motion.div>
            <p>Enter your postcode to preview your coverage area</p>
          </div>
        )}
      </div>

      {/* Continue */}
      <button
        disabled={!ready}
        className={`w-full py-3 mt-6 font-semibold rounded-xl transition-all ${
          ready
            ? "bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/30 hover:opacity-90"
            : "bg-white/10 text-sky-200 cursor-not-allowed"
        }`}
        onClick={() =>
          alert(
            \`Saved: \${postcode} (\${radius} mi radius). Next step placeholder.\`
          )
        }
      >
        Continue →
      </button>
    </motion.div>
  );
}
