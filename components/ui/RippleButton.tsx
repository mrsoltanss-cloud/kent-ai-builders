'use client'
import { ButtonHTMLAttributes, useRef } from 'react'

export default function RippleButton({
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null)

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current
    if (btn) {
      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const radius = diameter / 2
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${e.clientX - (btn.getBoundingClientRect().left + radius)}px`
      circle.style.top = `${e.clientY - (btn.getBoundingClientRect().top + radius)}px`
      circle.className = 'ripple'
      const old = btn.getElementsByClassName('ripple')[0]
      if (old) old.remove()
      btn.appendChild(circle)
      setTimeout(() => circle.remove(), 600)
    }
    props.onClick?.(e)
  }

  return (
    <button ref={ref} {...props} onClick={onClick}
      className={`relative overflow-hidden ${className}`}>
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms ease-out;
          background: rgba(14,165,233,0.25);
          pointer-events: none;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      {children}
    </button>
  )
}
