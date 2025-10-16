"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function FlowBackground({ hue = 150 }: { hue?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(my, [0, 1], [8, -8]);
  const ry = useTransform(mx, [0, 1], [-8, 8]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" as any }}
    >
      <div
        className="absolute inset-0"
        style={{
          filter: `hue-rotate(${hue}deg)`,
          background:
            "radial-gradient(60% 55% at 15% 10%, rgba(16,185,129,.22), transparent 60%), radial-gradient(50% 45% at 85% 15%, rgba(16,185,129,.18), transparent 60%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-flow" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-flow)" className="text-emerald-700" />
      </svg>
    </motion.div>
  );
}
