'use client'
import React from 'react'

type Props = {
  title?: string
  subtitle?: string
  hint?: string
  action?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function Empty({
  title = 'Nothing here yet',
  subtitle,
  hint,
  action,
  className = '',
  ...rest
}: Props) {
  const sub = subtitle ?? hint ?? 'Once you’ve got data, it will appear here.'
  return (
    <div
      className={
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-10 text-center ' +
        className
      }
      {...rest}
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-slate-500">{sub}</div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
