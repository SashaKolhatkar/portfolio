import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMotionValue } from 'framer-motion'

/* -------------------------------------------------------------------------- */
/*  Settings — Fast Mode is a first-class feature, not an afterthought.       */
/* -------------------------------------------------------------------------- */

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [fast, setFast] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('sk-fast-mode')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('fast-mode', fast)
    window.localStorage.setItem('sk-fast-mode', String(fast))
  }, [fast])

  const value = useMemo(
    () => ({ fast, toggleFast: () => setFast((v) => !v) }),
    [fast],
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}

/* -------------------------------------------------------------------------- */
/*  Pointer — one global listener, shared by canvas, cursor and parallax.     */
/* -------------------------------------------------------------------------- */

const PointerContext = createContext(null)

export function PointerProvider({ children }) {
  const raw = useRef({ x: 0.5, y: 0.5, px: 0, py: 0 })
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  useEffect(() => {
    const onMove = (event) => {
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      raw.current = { x, y, px: event.clientX, py: event.clientY }
      mx.set(x)
      my.set(y)
      px.set(event.clientX)
      py.set(event.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, px, py])

  const value = useMemo(() => ({ raw, mx, my, px, py }), [raw, mx, my, px, py])

  return (
    <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
  )
}

export function usePointer() {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used inside PointerProvider')
  return ctx
}
