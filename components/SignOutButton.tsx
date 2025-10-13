'use client'
export default function SignOutButton() {
  return (
    <button
      type="button"
      className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100"
      onClick={() => alert('Sign-out coming soon')}
    >
      Sign out
    </button>
  )
}
