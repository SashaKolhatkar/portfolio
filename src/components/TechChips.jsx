import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '../data'
import { useSettings } from '../context'

export default function TechChips() {
  const { fast } = useSettings()
  const rootRef = useRef(null)
  const chipRefs = useRef({})
  const [hovered, setHovered] = useState(null)
  const [lines, setLines] = useState([])

  useEffect(() => {
    if (fast || !hovered || !rootRef.current) {
      setLines([])
      return
    }
    const root = rootRef.current.getBoundingClientRect()
    const from = chipRefs.current[hovered]?.getBoundingClientRect()
    if (!from) return

    const x1 = from.left - root.left + from.width / 2
    const y1 = from.top - root.top + from.height / 2

    setLines(
      TECH_STACK.filter((tech) => tech !== hovered)
        .map((tech, index) => {
          const rect = chipRefs.current[tech]?.getBoundingClientRect()
          if (!rect) return null
          const x2 = rect.left - root.left + rect.width / 2
          const y2 = rect.top - root.top + rect.height / 2
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 - 16 - (index % 2) * 10
          return {
            id: tech,
            d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`,
            delay: index * 0.045,
          }
        })
        .filter(Boolean),
    )
  }, [hovered, fast])

  return (
    <div className="w-full">
      <div ref={rootRef} className="relative flex max-w-xl flex-wrap gap-2">
        {!fast && (
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="chip-flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            {lines.map((line) => (
              <g key={line.id}>
                <motion.path
                  d={line.d}
                  fill="none"
                  stroke="url(#chip-flow)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.5, delay: line.delay }}
                />
                <motion.circle r="2" fill="#00F0FF">
                  <animateMotion
                    dur="1.8s"
                    begin={`${line.delay}s`}
                    repeatCount="indefinite"
                    path={line.d}
                  />
                </motion.circle>
              </g>
            ))}
          </svg>
        )}

        {TECH_STACK.map((tech) => (
          <motion.button
            key={tech}
            ref={(el) => {
              chipRefs.current[tech] = el
            }}
            type="button"
            className="tech-chip relative z-10"
            whileHover={fast ? undefined : { y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => !fast && setHovered(tech)}
            onHoverEnd={() => setHovered(null)}
            onFocus={() => !fast && setHovered(tech)}
            onBlur={() => setHovered(null)}
            aria-label={`${tech} — hover to trace data flow`}
          >
            <span
              className={`h-1 w-1 rounded-full transition-all duration-300 ${
                hovered === tech
                  ? 'bg-neon shadow-[0_0_8px_#00F0FF]'
                  : 'bg-white/25'
              }`}
            />
            {tech}
          </motion.button>
        ))}
      </div>
      <p className="mono-label mt-3 flex items-center gap-2 text-[9px] opacity-60">
        <span className="h-1 w-1 animate-pulse rounded-full bg-neon" />
        {fast
          ? 'Data-flow traces disabled in fast mode'
          : 'Hover a node to trace its data flow'}
      </p>
    </div>
  )
}
