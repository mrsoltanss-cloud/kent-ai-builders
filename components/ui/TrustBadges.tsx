'use client'
import { ShieldCheck, MailCheck, Lock } from 'lucide-react'

export default function TrustBadges() {
  const items = [
    { icon: ShieldCheck, text: "Bank-grade security" },
    { icon: MailCheck, text: "Email verified" },
    { icon: Lock, text: "GDPR friendly" },
  ]
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs mt-8 text-cyan-200/80">
      {items.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1">
          <Icon size={14} className="text-cyan-400 drop-shadow-[0_0_3px_rgba(6,182,212,0.5)]" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  )
}
