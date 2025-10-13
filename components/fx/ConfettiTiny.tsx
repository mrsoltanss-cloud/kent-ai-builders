'use client'
import { useEffect } from 'react'
export default function ConfettiTiny({ fire=false }:{fire?:boolean}) {
  useEffect(()=>{ if(!fire) return; import('canvas-confetti').then(m=>m.default({ particleCount: 80, spread: 70, startVelocity: 24, scalar:.7 })) },[fire])
  return null
}
