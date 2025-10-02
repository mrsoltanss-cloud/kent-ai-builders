"use client"
import { toast } from "sonner"

export async function apiJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: { "content-type":"application/json", ...(init?.headers||{}) } })
  if (!res.ok) {
    const txt = await res.text().catch(()=>"")
    toast.error(`Request failed (${res.status})`)
    throw new Error(txt || `HTTP ${res.status}`)
  }
  return res.json()
}
