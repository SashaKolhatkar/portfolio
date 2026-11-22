import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { NAV_LINKS } from '../data'
import { useSettings } from '../context'
import { BlinkDot, Icon } from './ui'

const THEMES = [
  { id: 'dark', icon: 'moon', label: 'Dark' },
  { id: 'light', icon: 'sun', label: 'Light' },
  { id: 'eco', icon: 'leaf', label: 'Eco' },
]

export default function Nav() {
  const { fast, toggleFast, theme, setTheme } = useSettings()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const nextTheme =
    THEMES[(THEMES.findIndex((t) => t.id === theme) + 1) % THEMES.length]

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/[0.07] bg-obsidian/75 backdrop-blur-xl">
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-neon shadow-[0_0_12px_rgba(0,240,255,0.6)]"
      />
      <div className="section-shell flex h-16 items-center justify-between gap-4">
        <a
          href="#hero"
          className="group flex shrink-0 items-center gap-2 font-mono text-xs font-semibold tracking-tight text-warm sm:text-sm"
        >
          <span className="h-2 w-2 rounded-full border border-neon transition-all group-hover:bg-neon group-hover:shadow-neon" />
          Sasha Kolhatkar
          <span className="text-neon">// ML</span>
          <span className="animate-pulse text-neon">_</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-neon ${
                active === link.id ? 'text-neon' : 'text-muted'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 sm:flex"
            role="group"
            aria-label="Colour theme"
          >
            {THEMES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={theme === option.id}
                aria-label={`${option.label} theme`}
                title={`${option.label} theme`}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  theme === option.id
                    ? 'bg-neon text-obsidian'
                    : 'text-muted hover:text-warm'
                }`}
              >
                <Icon name={option.icon} size={13} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTheme(nextTheme.id)}
            aria-label={`Switch to ${nextTheme.label} theme`}
            title={`Theme: ${theme}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neon sm:hidden"
          >
            <Icon name={nextTheme.icon} size={15} />
          </button>
          <button
            type="button"
            onClick={toggleFast}
            aria-pressed={fast}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 transition-colors hover:border-neon/40 sm:px-3"
            title="Disable heavy animation for a faster experience"
          >
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-muted sm:inline">
              Fast mode
            </span>
            <span className="relative h-4 w-8 rounded-full bg-white/10">
              <motion.span
                className="absolute top-0.5 h-3 w-3 rounded-full"
                animate={{ x: fast ? 17 : 2, background: fast ? '#00F0FF' : '#8B93A7' }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            </span>
          </button>

          <a
            href="https://github.com/SashaKolhatkar"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-neon/50 hover:text-neon"
          >
            <Icon name="github" size={16} />
          </a>
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm/80 transition-colors hover:border-neon/50 hover:text-neon sm:flex"
          >
            Résumé <Icon name="arrowUpRight" size={12} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-warm lg:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={17} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: fast ? 0 : 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-obsidian/95 lg:hidden"
          >
            <nav className="section-shell flex flex-col py-4" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/5 py-3 font-mono text-xs tracking-widest text-muted hover:text-neon"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 flex items-center gap-2 font-mono text-xs tracking-widest text-neon"
              >
                <BlinkDot /> Résumé / Contact
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
