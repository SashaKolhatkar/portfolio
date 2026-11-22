import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context'
import { BlinkDot } from './ui'

function wavePath(tick, fast) {
  const points = Array.from({ length: 44 }, (_, i) => {
    const x = (i / 43) * 300
    const y =
      32 +
      Math.sin(i * 0.55 + tick * 0.35) * (fast ? 6 : 14) * Math.exp(-i / 90) +
      Math.sin(i * 1.7 + tick * 0.2) * 3
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  })
  return points.join(' ')
}

export default function TrainingHUD() {
  const { fast } = useSettings()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (fast) return undefined
    const id = window.setInterval(() => setTick((t) => t + 1), 1500)
    return () => window.clearInterval(id)
  }, [fast])

  const epoch = 42 + (tick % 18)
  const loss = (0.184 * Math.pow(0.93, tick % 18) + 0.021).toFixed(3)
  const accuracy = (96.2 + (tick % 18) * 0.12).toFixed(2)

  return (
    <div className="panel relative overflow-hidden rounded-2xl shadow-neon-lg">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full border border-neon/60" />
          <span className="mono-label text-warm/70">MODEL TRAINING STATE</span>
        </div>
        <div className="flex items-center gap-2">
          <BlinkDot />
          <span className="font-mono text-[9px] uppercase tracking-widest text-neon">
            Live
          </span>
        </div>
      </div>

      <div className="relative grid grid-cols-3 divide-x divide-white/10">
        {[
          { label: 'Epoch', value: `${epoch}/60` },
          { label: 'Loss', value: loss },
          { label: 'Val acc', value: `${accuracy}%` },
        ].map((item) => (
          <div key={item.label} className="px-4 py-5">
            <div className="mono-label text-[9px]">{item.label}</div>
            <motion.div
              key={fast ? 'static' : item.value}
              initial={fast ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-2 font-mono text-lg text-warm sm:text-xl"
            >
              {item.value}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="mono-label text-[9px]">Gradient flow</span>
          <span className="font-mono text-[9px] text-neon/70">σ 0.042</span>
        </div>
        <svg viewBox="0 0 300 64" className="h-16 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hud-wave" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                style={{ stopColor: 'rgb(var(--c-accent))' }}
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                style={{ stopColor: 'rgb(var(--c-accent))' }}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path
            d={`${wavePath(tick, fast)} L300 64 L0 64 Z`}
            fill="url(#hud-wave)"
          />
          <motion.path
            key={tick}
            d={wavePath(tick, fast)}
            fill="none"
            style={{ stroke: 'rgb(var(--c-accent))' }}
            strokeWidth="1.4"
            initial={fast ? false : { pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: fast ? 0 : 0.9, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-3">
        <span className="mono-label text-[9px]">Optimizer / AdamW</span>
        <span className="font-mono text-[9px] text-neon">CONVERGING</span>
      </div>
    </div>
  )
}
