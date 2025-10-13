'use client'
import { useState } from 'react'

type ChangeFn =
  | ((data: Record<string, any>) => void)
  | ((id: string, value: any) => void)

type Props = {
  service?: string | null
  values?: Record<string, any>
  onChange?: ChangeFn
}

export default function ServiceMicroQuestions({ service = 'general', values, onChange }: Props) {
  const [answers, setAnswers] = useState<Record<string, any>>(values ?? {})

  function emit(next: Record<string, any>, changedKey?: string) {
    setAnswers(next)
    if (!onChange) return
    // Support either signature:
    if (onChange.length === 2 && changedKey) {
      ;(onChange as (id: string, value: any) => void)(changedKey, next[changedKey])
    } else {
      ;(onChange as (data: Record<string, any>) => void)(next)
    }
  }

  function setField(k: string, v: any) {
    const next = { ...answers, [k]: v }
    emit(next, k)
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-sm text-slate-500 mb-2">
        Quick details for <b>{service ?? 'general'}</b>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="input input-bordered"
          placeholder="Rooms (e.g. 1–3)"
          defaultValue={answers.rooms ?? ''}
          onChange={(e)=>setField('rooms', e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Approx. sqm"
          defaultValue={answers.sqm ?? ''}
          onChange={(e)=>setField('sqm', e.target.value)}
        />
        <select
          className="select select-bordered"
          defaultValue={answers.urgency ?? ''}
          onChange={(e)=>setField('urgency', e.target.value)}
        >
          <option value="">Urgency</option>
          <option value="FLEXIBLE">Flexible</option>
          <option value="SOON">Soon</option>
          <option value="URGENT">Urgent</option>
        </select>
        <input
          className="input input-bordered"
          placeholder="Budget (e.g. £2k–£4k)"
          defaultValue={answers.budget ?? ''}
          onChange={(e)=>setField('budget', e.target.value)}
        />
      </div>
    </div>
  )
}
