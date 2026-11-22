import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TIMELINE } from '../data'
import { useSettings } from '../context'
import { BlinkDot, Icon, Reveal, SectionTitle } from './ui'

const SHADES = ['#1B1F29', '#0E4E56', '#0B7C87', '#00B8C7', '#00F0FF']

function ContributionGraph() {
  const cells = Array.from({ length: 7 * 26 }, (_, i) => {
    const v = ((i * 9301 + 49297) % 233280) / 233280
    if (v > 0.86) return 4
    if (v > 0.66) return 3
    if (v > 0.44) return 2
    if (v > 0.2) return 1
    return 0
  })

  return (
    <div className="panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="activity" size={15} className="text-neon" />
          <span className="mono-label text-warm/70">Contribution activity</span>
        </div>
        <span className="font-mono text-[9px] text-neon/60">LAST 26 WEEKS</span>
      </div>
      <div className="mt-5 overflow-x-auto pb-1">
        <div
          className="grid min-w-[420px] gap-[3px]"
          style={{
            gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
            gridAutoFlow: 'column',
          }}
        >
          {cells.map((level, i) => (
            <motion.span
              key={i}
              title={`Activity level ${level}`}
              className="aspect-square w-full rounded-[2px]"
              style={{ background: SHADES[level] }}
              whileHover={{ scale: 1.5, zIndex: 2 }}
              transition={{ duration: 0.12 }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted/60">26 weeks ago</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] text-muted/60">Less</span>
          {SHADES.map((shade) => (
            <span
              key={shade}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ background: shade }}
            />
          ))}
          <span className="font-mono text-[9px] text-muted/60">More</span>
        </div>
        <span className="font-mono text-[9px] text-muted/60">Today</span>
      </div>
    </div>
  )
}

function TimelineItem({ item, index }) {
  const { fast } = useSettings()
  const [open, setOpen] = useState(index === 0)

  return (
    <Reveal delay={index * 0.1}>
      <div className="relative grid gap-4 border-l border-white/10 pb-10 pl-7 sm:grid-cols-[150px_1fr] sm:pl-10">
        <span
          className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-neon bg-obsidian shadow-[0_0_12px_rgba(0,240,255,0.6)]"
          aria-hidden="true"
        />
        <div className="font-mono text-[10px] uppercase tracking-widest text-neon/70">
          {item.period}
          <div className="mt-2 text-[8px] text-muted">{item.kind}</div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="group w-full text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight text-warm transition-colors group-hover:text-neon sm:text-2xl">
                {item.title}
              </h3>
              <span className="mt-1 text-neon">
                <Icon name={open ? 'minus' : 'plus'} size={18} />
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{item.org}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-warm/60">
              {item.blurb}
            </p>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: fast ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <ul className="mt-5 space-y-2.5 border-l border-neon/20 pl-4">
                  {item.details.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neon" />
                      {line}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="section-shell relative">
        <SectionTitle
          index="04"
          kicker="ORIGIN"
          title="Where the"
          accent="signal starts."
          description="A B.Tech in AIML, a habit of shipping, and a preference for understanding systems all the way down."
        />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {TIMELINE.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
            <div className="mt-2 flex items-center gap-2 pl-7 sm:pl-10">
              <BlinkDot />
              <span className="mono-label text-[9px] text-neon">
                Still training.
              </span>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <ContributionGraph />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="panel rounded-2xl p-6">
                <span className="mono-label">Current focus</span>
                <p className="mt-4 font-editorial text-3xl leading-tight text-warm">
                  Retrieval systems, evaluation discipline and interfaces that
                  explain themselves.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['PyTorch', 'FastAPI', 'React', 'SQL'].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
