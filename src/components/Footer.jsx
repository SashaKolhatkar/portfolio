import { motion } from 'framer-motion'
import { useSettings } from '../context'
import { LINKEDIN_URL } from '../data'
import { BlinkDot, Icon, Reveal } from './ui'

export default function Footer() {
  const { fast } = useSettings()

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 pt-24 sm:pt-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-neon/[0.06] blur-3xl" />
      <div className="section-shell relative pb-10">
        <Reveal>
          <span className="mono-label flex items-center gap-2 text-neon">
            <BlinkDot /> 05 / CONTACT
          </span>
          <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            Let&apos;s build something{' '}
            <span className="font-editorial italic text-neon">that learns.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="mailto:sashakolhatkar28@gmail.com"
              className="btn-primary"
            >
              <Icon name="mail" size={15} /> Start a conversation
              <span className="hidden border-l border-obsidian/30 pl-3 font-mono text-[10px] font-normal normal-case tracking-normal opacity-70 sm:inline">
                sashakolhatkar28@gmail.com
              </span>
            </a>
            <a
              href="https://github.com/SashaKolhatkar"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Icon name="github" size={15} /> GitHub
            </a>
            <a
              href={`${import.meta.env.BASE_URL}SashaKolhatkar-Resume.pdf`}
              className="btn-ghost"
            >
              <Icon name="arrowUpRight" size={15} /> Résumé PDF
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Icon name="linkedin" size={15} /> LinkedIn
            </a>
          </div>
        </Reveal>

        <div className="mt-24 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="mono-label text-[9px]">
              © {new Date().getFullYear()} Sasha Kolhatkar
            </span>
            <span className="mono-label hidden text-[9px] sm:inline">
              React · Tailwind · Framer Motion
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="mono-label flex items-center gap-2 text-[9px] text-neon/70">
              <BlinkDot /> All systems converged
            </span>
            <motion.a
              href="#hero"
              whileHover={fast ? undefined : { y: -3 }}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted hover:text-neon"
            >
              Back to top <Icon name="arrowUpRight" size={13} />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  )
}
