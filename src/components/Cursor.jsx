import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { usePointer, useSettings } from '../context'

export default function Cursor() {
  const { fast } = useSettings()
  const { px, py } = usePointer()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const ringX = useSpring(px, { stiffness: 260, damping: 26, mass: 0.45 })
  const ringY = useSpring(py, { stiffness: 260, damping: 26, mass: 0.45 })

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || fast) return undefined
    document.body.classList.add('custom-cursor')
    const onOver = (event) => {
      const target = event.target
      setHovering(
        Boolean(target?.closest?.('a, button, input, textarea, [role="button"]')),
      )
    }
    document.addEventListener('pointerover', onOver)
    return () => {
      document.body.classList.remove('custom-cursor')
      document.removeEventListener('pointerover', onOver)
    }
  }, [enabled, fast])

  if (!enabled || fast) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ left: px, top: py }} />
      <motion.div
        className="cursor-ring"
        style={{ left: ringX, top: ringY }}
        animate={{ scale: hovering ? 1.9 : 1, opacity: hovering ? 0.9 : 0.6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      />
    </>
  )
}
