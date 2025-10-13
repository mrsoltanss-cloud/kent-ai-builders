// components/trade/ContactModal.tsx
'use client'

import * as React from 'react'
import { toast } from 'sonner'

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

export type ContactModalProps = {
  job: { id: string; title: string; postcode?: string | null } | null
  open: boolean
  onClose: () => void
}

function detectTrade(title: string) {
  const t = (title || '').toLowerCase()
  if (/(paint|decorat)/.test(t)) return 'painting'
  if (/(bath|tile|shower)/.test(t)) return 'bathroom'
  if (/(kitchen|worktop|cabinet)/.test(t)) return 'kitchen'
  if (/(fence|landscap|patio|garden|deck)/.test(t)) return 'landscaping'
  if (/(roof|gutter|soffit|fascia)/.test(t)) return 'roofing'
  if (/(electr|ev|rewire|socket|light)/.test(t)) return 'electrical'
  if (/(plumb|radiator|boiler|heating|pipe)/.test(t)) return 'plumbing'
  if (/(carpentry|joiner|door|skirting|architrave)/.test(t)) return 'carpentry'
  return 'general'
}

const TEMPLATES: Record<string, string[]> = {
  painting: [
    "Hi, I’m a local decorator and can visit this week to quote. I include prep, filling, and clean edges. When suits you?",
    "Hi! Available in the next few days. I’ll protect floors and tidy daily. Could we arrange a quick look?",
  ],
  bathroom: [
    "Hi, I fit/refresh bathrooms regularly. I can check plumbing, tiling and silicone lines. When’s best for a quote?",
    "Hello! I’m available to survey your bathroom and advise on tiles/fixtures. Happy to quote—what times work?",
  ],
  kitchen: [
    "Hi, I install kitchens with full service points check. I can visit to measure and quote—when suits?",
    "Hello! I can help with fit, scribing and worktops. Free survey this week—shall we book a slot?",
  ],
  landscaping: [
    "Hi, I do fencing/patios locally. I can check levels and access, then quote fairly. When could I pop by?",
    "Hello! Happy to quote for the garden works. I’m nearby—could we arrange a quick visit?",
  ],
  roofing: [
    "Hi, I can inspect tiles/flashing and quote for repairs. I’m insured and local—when’s good?",
    "Hello! Available to assess roof/gutters and provide a fixed quote. What day suits?",
  ],
  electrical: [
    "Hi, NICEIC-equivalent work with certs. I can visit to quote for the electrics—when’s convenient?",
    "Hello! Available this week for a survey and quote on the electrical works. What time works?",
  ],
  plumbing: [
    "Hi, Gas Safe plumbing/heating. I can look at the system and quote—when suits you?",
    "Hello! I’m local and can attend to quote for the plumbing/heating. Free visit—what day is best?",
  ],
  carpentry: [
    "Hi, I handle doors, skirting and bespoke carpentry. I can measure up and quote—when’s good?",
    "Hello! Available to view and quote your carpentry work this week. Shall we schedule?",
  ],
  general: [
    "Hi, I’m a local tradesperson and can visit this week to quote. When suits you?",
    "Hello! Happy to pop by and give a fair quote. What day/time works best?",
  ],
}

export default function ContactModal({ job, open, onClose }: ContactModalProps) {
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [msg, setMsg] = React.useState('')
  const [agree, setAgree] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [templateKey, setTemplateKey] = React.useState<string>('general')
  const maxLen = 280
  const remaining = Math.max(0, maxLen - msg.length)

  const dirty =
    !!name.trim() || !!phone.trim() || !!msg.trim() || agree

  // Prefill template on open (only if message empty)
  React.useEffect(() => {
    if (open && job) {
      const key = detectTrade(job.title)
      setTemplateKey(key)
      if (!msg.trim()) {
        const t = TEMPLATES[key]?.[0] ?? TEMPLATES.general[0]
        setMsg(t)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, job?.id])

  React.useEffect(() => {
    if (open) {
      setName(''); setPhone(''); setAgree(false); setBusy(false)
      // keep msg if we just set a template above; if not, ensure not over max
      setMsg((m) => m.slice(0, maxLen))
    }
  }, [open])

  if (!open || !job) return null

  const canSend = !busy && name.trim() && phone.trim() && msg.trim() && agree

  function confirmAndClose() {
    if (busy) return
    if (dirty && !window.confirm('Discard your message?')) return
    onClose()
  }

  function applyTemplate(k: string, idx = 0) {
    setTemplateKey(k)
    const tpl = TEMPLATES[k]?.[idx]
    if (tpl) setMsg(tpl)
  }

  async function submit() {
    if (!canSend) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 700))
    toast.success('Your contact request has been queued 🎉', {
      description: `Job: ${job?.title ?? "selected job"} — we’ll notify the homeowner.`,
    })
    setBusy(false)
    onClose()
  }

  const keys = Object.keys(TEMPLATES)

  return (
    <div className="fixed inset-0 z-[60]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={confirmAndClose}
        aria-hidden
      />
      {/* dialog */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b p-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold truncate">Contact homeowner</h2>
              <p className="text-xs text-neutral-500 truncate">
                {job.title} {job.postcode ? `• ${job.postcode}` : ''}
              </p>
            </div>
            <button
              onClick={confirmAndClose}
              disabled={busy}
              className="rounded-md px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
              aria-label="Close"
            >
              ✖️
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Template chooser */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Template</label>
                <select
                  value={templateKey}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  {keys.map((k) => (
                    <option key={k} value={k}>
                      {k === 'general' ? 'General' : k[0].toUpperCase() + k.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => applyTemplate(templateKey, 0)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm hover:bg-neutral-50"
                  title="Apply template 1"
                >
                  ✍️ Use template 1
                </button>
                <button
                  onClick={() => applyTemplate(templateKey, 1)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm hover:bg-neutral-50"
                  title="Apply template 2"
                >
                  ✍️ Use template 2
                </button>
              </div>
            </div>

            {/* Contact fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Phone / WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="+44 7…"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs text-neutral-600">Message to homeowner</label>
                <span className={clsx('text-xs', remaining < 30 && 'text-amber-600')}>
                  {remaining} chars left
                </span>
              </div>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value.slice(0, maxLen))}
                rows={4}
                className="w-full resize-none rounded-lg border px-3 py-2 text-sm"
                placeholder="Hi, I can visit this week to quote. I’m local and fully insured. When’s best?"
              />
              <div className="mt-1 text-xs text-neutral-500">
                Tip: keep it short and include availability. A friendly greeting helps 🙂.
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-neutral-700">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              I agree to be contacted about this job and accept processing of my details.
            </label>
          </div>

          <div className="flex items-center justify-between border-t p-3">
            <div className="text-xs text-neutral-500">No charge to send — bids may be limited.</div>
            <div className="flex gap-2">
              <button
                onClick={confirmAndClose}
                disabled={busy}
                className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!canSend}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm text-white',
                  canSend ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-neutral-400'
                )}
              >
                {busy ? 'Sending…' : 'Send contact request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
