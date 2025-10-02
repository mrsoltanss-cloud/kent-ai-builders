"use client";
import Link from "next/link";

type Props = {
  phone?: string;
  text?: string;
  className?: string;
};

export default function WhatsAppButton({
  phone = "447000000000",
  text = "Hi, I just requested a quote on Brixel. Here are my photos…",
  className = "",
}: Props) {
  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition ${className}`}
    >
      <span>Send photos on WhatsApp</span>
    </Link>
  );
}
