import { motion } from 'framer-motion'
import { useSettings } from '../context'

const paths = {
  github:
    'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.99c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  external:
    'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  arrowRight: 'M4 12h15M13 6l6 6-6 6',
  arrowDown: 'M12 4v15M6 13l6 6 6-6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  mail: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm1.2.3L12 13l7.8-6.2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  cpu: 'M8 8h8v8H8zM4 9h4M4 15h4M16 9h4M16 15h4M9 4v4M15 4v4M9 16v4M15 16v4',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17l9 5 9-5',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16',
  sun: 'M12 5V3M12 21v-2M5 12H3M21 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
  leaf: 'M20 4C11 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-7 11-16ZM4 20c3-5 7-8 12-10',
}

export function Icon({ name, size = 16, className = '', strokeWidth = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {name === 'github' ? (
        <path d={paths.github} fill="currentColor" stroke="none" />
      ) : (
        <path d={paths[name] || paths.activity} />
      )}
    </svg>
  )
}

export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  const { fast } = useSettings()
  return (
    <motion.div
      className={className}
      initial={fast ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={
        fast
          ? { duration: 0 }
          : { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ index, children, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-neon" />
      <span className="mono-label text-neon">
        {index} / {children}
      </span>
    </div>
  )
}

export function SectionTitle({ index, kicker, title, accent, description }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <Reveal>
        <Eyebrow index={index}>{kicker}</Eyebrow>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
          {title}
          {accent && <span className="block text-neon">{accent}</span>}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="max-w-md text-sm leading-relaxed text-muted md:text-right">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border border-neon/20 bg-neon/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neon/80">
      {children}
    </span>
  )
}

export function BlinkDot({ className = '' }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-[0_0_10px_#00F0FF] ${className}`}
    />
  )
}
