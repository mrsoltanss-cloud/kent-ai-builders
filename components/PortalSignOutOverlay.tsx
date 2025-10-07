"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SignOutButton from "./SignOutButton";

export default function PortalSignOutOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-[2000] pointer-events-auto">
      <SignOutButton />
    </div>,
    document.body
  );
}
