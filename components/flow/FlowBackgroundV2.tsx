"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let id: number;
    function fit() { c.width = window.innerWidth; c.height = window.innerHeight; }
    fit(); window.addEventListener("resize", fit);
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * Math.PI * 2,
      s: 0.15 + Math.random() * 0.45,
      o: 0.25 + Math.random() * 0.35
    }));
    const loop = () => {
      ctx.clearRect(0,0,c.width,c.height);
      for (const d of dots) {
        d.a += 0.003 * d.s;
        d.x += Math.cos(d.a) * 0.15;
        d.y += Math.sin(d.a) * 0.15;
        if (d.x < 0) d.x = c.width; if (d.x > c.width) d.x = 0;
        if (d.y < 0) d.y = c.height; if (d.y > c.height) d.y = 0;
        ctx.globalAlpha = d.o;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.fillStyle = "#10b981"; ctx.fill();
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", fit); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />;
}

export default function FlowBackgroundV2({ hue = 140 }: { hue?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(my, [0, 1], [7, -7]);
  const ry = useTransform(mx, [0, 1], [-7, 7]);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX / window.innerWidth); my.set(e.clientY / window.innerHeight); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx,my]);

  const bg = useMemo(() => ({
    filter: `hue-rotate(${hue}deg)`,
    background:
      "radial-gradient(55% 60% at 15% 10%, rgba(16,185,129,.26), transparent 60%), radial-gradient(45% 55% at 85% 15%, rgba(16,185,129,.22), transparent 60%), radial-gradient(60% 45% at 50% 100%, rgba(16,185,129,.18), transparent 60%)",
  }), [hue]);

  return (
    <motion.div className="fixed inset-0 -z-10" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" as any }}>
      <div className="absolute inset-0" style={bg} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="grid-flow-v2" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid-flow-v2)" className="text-emerald-700" />
      </svg>
      <Particles />
    </motion.div>
  );
}
