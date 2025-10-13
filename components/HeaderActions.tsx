'use client'
import Link from 'next/link'
export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/quote" className="btn btn-sm btn-primary">Get Estimate</Link>
      <Link href="/trade/signup" className="btn btn-sm btn-outline">For Builders</Link>
    </div>
  )
}
