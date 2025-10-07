"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOutButton";

export default function PortalSignOutOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-6 top-20 z-[1000]">
      <SignOutButton />
    </div>,
    document.body
  );
}
