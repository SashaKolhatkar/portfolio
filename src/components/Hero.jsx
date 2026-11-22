import { motion, useSpring, useTransform } from 'framer-motion'
import { usePointer, useSettings } from '../context'
import ParticleField from './ParticleField'
import TechChips from './TechChips'
import TrainingHUD from './TrainingHUD'
import { BlinkDot, Icon } from './ui'

export default function Hero() {
  const { fast } = useSettings()
  const { mx, my } = usePointer()

  const driftX = useSpring(useTransform(my, [0, 1], [16, -16]), {
    stiffness: 80,
    damping: 22,
  })
  const driftY = useSpring(useTransform(mx, [0, 1], [-14, 14]), {
    stiffness: 80,
    damping: 22,
  })

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: fast ? 0 : 0.09,
        delayChildren: fast ? 0 : 0.12,
      },
    },
  }
  const item = {
    hidden: { opacity: 0, y: fast ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: fast ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28 sm:pt-32"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <ParticleField />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />

      <div className="section-shell relative z-10 grid w-full items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <span className="mono-label flex items-center gap-2 text-neon">
              <BlinkDot /> ML / FULL-STACK ENGINEER
            </span>
            <span className="hidden h-px w-10 bg-white/20 sm:block" />
            <span className="mono-label">PORTFOLIO / 2026</span>
          </motion.div>

          <motion.h1
            variants={item}
            style={fast ? undefined : { x: driftY, y: driftX }}
            className="mt-7 text-[clamp(3.4rem,9vw,8.2rem)] font-semibold leading-[0.86] tracking-[-0.065em]"
          >
            <span className="block">Sasha</span>
            <span className="block bg-gradient-to-r from-warm via-warm to-neon/70 bg-clip-text text-transparent">
              Kolhatkar
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 font-mono text-sm tracking-[0.08em] text-neon sm:text-base"
          >
            // BUILDING INTELLIGENT SYSTEMS
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            B.Tech in AIML. Full-stack &amp; ML engineer crafting adaptive software —
            from the first vector to the last pixel of the interface.
          </motion.p>

          <motion.div variants={item} className="mt-9">
            <TechChips />
          </motion.div>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a className="btn-primary" href="#lens">
              <Icon name="scan" size={15} /> Enter the lens
            </a>
            <a className="btn-ghost" href="#work">
              View selected work <Icon name="arrowRight" size={15} />
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6"
          >
            {[
              ['05', 'Shipped systems'],
              ['06', 'Core tools'],
              ['∞', 'Iterations'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-mono text-2xl text-warm">{value}</div>
                <div className="mono-label mt-1 text-[9px]">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={fast ? false : { opacity: 0, x: 34, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: fast ? 0 : 1, delay: fast ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-neon/[0.07] blur-3xl" />
          <TrainingHUD />
          <div className="mt-4 flex items-center justify-between px-1">
            <span className="mono-label text-[9px]">
              coordinates / {Math.round((mx.get() || 0.5) * 100)} :{' '}
              {Math.round((my.get() || 0.5) * 100)}
            </span>
            <span className="mono-label text-[9px] text-neon/70">
              seed // SK-2026
            </span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="mono-label text-[9px]">Scroll to scan</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-neon"
            animate={fast ? undefined : { y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}
