"use client";

export default function WhatsAppShare({
  title,
  url,               // optional: if not provided, uses current location
  size = "btn-sm",   // btn-xs | btn-sm | btn-md
}: { title: string; url?: string; size?: "btn-xs"|"btn-sm"|"btn-md" }) {
  let shareUrl = url;
  if (!shareUrl && typeof window !== "undefined") shareUrl = window.location.href;
  const text = encodeURIComponent(`Job: ${title}\n${shareUrl ?? ""}`);
  const href = `https://wa.me/?text=${text}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`btn btn-success ${size}`}
      aria-label="Share via WhatsApp"
    >
      WhatsApp
    </a>
  );
}
