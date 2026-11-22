import { useMemo, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from 'framer-motion'
import { useSettings } from '../context'

/* ----------------------------- BatterySense ------------------------------ */

const BATTERY_DATA = [
  0.98, 0.965, 0.95, 0.958, 0.94, 0.932, 0.936, 0.91, 0.902, 0.888, 0.895,
  0.87, 0.858, 0.84,
]

function batteryPaths() {
  const w = 320
  const h = 120
  const min = 0.82
  const max = 1
  const pts = BATTERY_DATA.map((v, i) => ({
    x: (i / (BATTERY_DATA.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * (h - 16) - 8,
  }))
  const line = `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`
  return { line, area: `${line} L ${w} ${h} L 0 ${h} Z`, pts }
}

export function BatteryChart() {
  const { fast } = useSettings()
  const { line, area, pts } = useMemo(batteryPaths, [])
  const circumference = 2 * Math.PI * 30

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative flex h-full gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
              Cycle degradation
            </span>
            <span className="font-mono text-[9px] text-neon">SOH ↓</span>
          </div>
          <svg
            viewBox="0 0 320 120"
            className="mt-2 h-[104px] w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="battery-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  style={{ stopColor: 'rgb(var(--c-accent))' }}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  style={{ stopColor: 'rgb(var(--c-accent))' }}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#battery-fill)" />
            <motion.path
              d={line}
              fill="none"
              style={{ stroke: 'rgb(var(--c-accent))' }}
              strokeWidth="2"
              strokeLinecap="round"
              initial={fast ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: fast ? 0 : 1.5, ease: 'easeOut' }}
            />
            {[6, 11].map((i) => (
              <motion.circle
                key={i}
                cx={pts[i].x}
                cy={pts[i].y}
                r="4"
                fill="#E9B872"
                initial={{ scale: 0 }}

                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: fast ? 0 : 1 + i * 0.05 }}
                animate={fast ? undefined : { opacity: [1, 0.35, 1] }}
              />
            ))}
          </svg>
        </div>
        <div className="flex w-[92px] shrink-0 flex-col items-center justify-center border-l border-white/10 pl-3">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#242832" strokeWidth="6" />
            <motion.circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              style={{ stroke: 'rgb(var(--c-accent))' }}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: circumference * (1 - 0.942) }}
              viewport={{ once: true }}
              transition={{ duration: fast ? 0 : 1.6, ease: 'easeOut' }}
            />
          </svg>
          <span className="-mt-12 font-mono text-sm text-warm">94.2%</span>
          <span className="mt-5 font-mono text-[8px] uppercase tracking-widest text-muted">
            Est. SoH
          </span>
        </div>
      </div>
      <span className="absolute bottom-2 left-4 font-mono text-[8px] text-[#E9B872]/80">
        ● 2 anomalies flagged
      </span>
    </div>
  )
}

/* ------------------------------ SentimentIQ ------------------------------ */

const POSITIVE = ['great', 'love', 'amazing', 'fast', 'good', 'excellent', 'sharp', 'accurate', 'happy', 'best', 'love']
const NEGATIVE = ['bad', 'slow', 'hate', 'terrible', 'broken', 'awful', 'worst', 'fail', 'bug', 'disappointing']

export function SentimentLab() {
  const { fast } = useSettings()
  const [text, setText] = useState('This model is remarkably fast and accurate.')

  const score = useMemo(() => {
    const words = text.toLowerCase().match(/[a-z]+/g) || []
    const positive = words.filter((w) => POSITIVE.includes(w)).length
    const negative = words.filter((w) => NEGATIVE.includes(w)).length
    const raw = (positive - negative) / Math.max(2.5, words.length / 3)
    return Math.max(-1, Math.min(1, raw))
  }, [text])

  const angle = score * 62
  const label = score > 0.12 ? 'POSITIVE' : score < -0.12 ? 'NEGATIVE' : 'NEUTRAL'
  const color = score > 0.12 ? '#00F0FF' : score < -0.12 ? '#E97C7C' : '#E9B872'

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
            Live inference
          </span>
          <span className="font-mono text-[9px]" style={{ color }}>
            {label} · {Math.round(Math.abs(score) * 100)}%
          </span>
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Type a sentence to analyse sentiment"
          placeholder="Type a sentence…"
          className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-[11px] text-warm outline-none transition-colors placeholder:text-muted/50 focus:border-neon/60"
        />
        <div className="mt-auto flex items-center justify-center">
          <svg viewBox="0 0 200 100" className="h-20 w-56">
            <defs>
              <linearGradient id="sentiment-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E97C7C" />
                <stop offset="50%" stopColor="#E9B872" />
                <stop
                  offset="100%"
                  style={{ stopColor: 'rgb(var(--c-accent))' }}
                />
              </linearGradient>
            </defs>
            <path
              d="M 20 84 A 80 80 0 0 1 180 84"
              fill="none"
              stroke="url(#sentiment-arc)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.8"
            />
            <motion.line
              x1="100"
              y1="84"
              x2="100"
              y2="24"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ rotate: fast ? 0 : angle }}
              transition={{ type: 'spring', stiffness: 110, damping: 14 }}
              style={{ originX: 0.5, originY: 1 }}
            />
            <circle cx="100" cy="84" r="5" fill="#F3F0E7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- Memoza --------------------------------- */

const INITIAL_TASKS = [
  { id: 't1', title: 'Ship inference API', quad: 0 },
  { id: 't2', title: 'Refactor data loader', quad: 1 },
  { id: 't3', title: 'Review model metrics', quad: 0 },
  { id: 't4', title: 'Archive old notebooks', quad: 3 },
  { id: 't5', title: 'Plan Q3 experiments', quad: 1 },
  { id: 't6', title: 'Delegate QA pass', quad: 2 },
]

const QUADRANTS = [
  { name: 'DO', hint: 'Urgent · Important', color: '#00F0FF' },
  { name: 'SCHEDULE', hint: 'Not urgent · Important', color: '#9BE88F' },
  { name: 'DELEGATE', hint: 'Urgent · Not important', color: '#E9B872' },
  { name: 'ELIMINATE', hint: 'Neither', color: '#8B93A7' },
]

export function MemozaMatrix() {
  const { fast } = useSettings()
  const [tasks, setTasks] = useState(INITIAL_TASKS)

  const move = (id) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, quad: (task.quad + 1) % 4 } : task,
      ),
    )

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-panel p-3">
      <div className="relative mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
          Eisenhower board · tap a card to sort
        </span>
        <button
          type="button"
          onClick={() => setTasks(INITIAL_TASKS)}
          className="font-mono text-[9px] text-neon/70 hover:text-neon"
        >
          RESET
        </button>
      </div>
      <LayoutGroup>
        <div className="grid h-[132px] grid-cols-2 grid-rows-2 gap-1.5">
          {QUADRANTS.map((quad, index) => (
            <div
              key={quad.name}
              className="relative overflow-hidden rounded border border-white/[0.07] bg-white/[0.02] p-1.5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="font-mono text-[7px] uppercase tracking-widest"
                  style={{ color: quad.color }}
                >
                  {quad.name}
                </span>
                <span className="font-mono text-[7px] text-muted/60">
                  {tasks.filter((t) => t.quad === index).length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {tasks
                  .filter((task) => task.quad === index)
                  .map((task) => (
                    <motion.button
                      key={task.id}
                      layoutId={fast ? undefined : task.id}
                      layout={!fast}
                      onClick={() => move(task.id)}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className={`truncate rounded border border-white/10 bg-elevated px-1.5 py-1 text-left font-mono text-[8px] text-warm/80 hover:border-neon/50 hover:text-neon ${
                        fast ? '' : 'cursor-pointer'
                      }`}
                      title="Move to next quadrant"
                    >
                      {task.title}
                    </motion.button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  )
}

/* -------------------------- Smart Crop Recommendation -------------------- */

const SLIDERS = [
  { key: 'n', label: 'Nitrogen', min: 0, max: 100, unit: 'kg/ha' },
  { key: 'p', label: 'Phosphorus', min: 0, max: 100, unit: 'kg/ha' },
  { key: 'temp', label: 'Temperature', min: 10, max: 40, unit: '°C' },
]

function recommend(values) {
  if (values.temp < 18 && values.n > 50) return { crop: 'WHEAT', confidence: 0.93 }
  if (values.n > 70 && values.p > 50) return { crop: 'RICE', confidence: 0.96 }
  if (values.temp > 28 && values.n < 60) return { crop: 'MAIZE', confidence: 0.89 }
  if (values.p < 30) return { crop: 'PULSES', confidence: 0.87 }
  return { crop: 'SOYBEAN', confidence: 0.91 }
}

export function CropLab() {
  const { fast } = useSettings()
  const [values, setValues] = useState({ n: 68, p: 42, temp: 24 })
  const result = recommend(values)

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex h-full gap-5">
        <div className="flex flex-1 flex-col justify-center gap-3">
          {SLIDERS.map((slider) => {
            const pct =
              ((values[slider.key] - slider.min) /
                (slider.max - slider.min)) *
              100
            return (
              <div key={slider.key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                    {slider.label}
                  </span>
                  <span className="font-mono text-[9px] text-neon">
                    {values[slider.key]} {slider.unit}
                  </span>
                </div>
                <input
                  type="range"
                  className="lab-range"
                  min={slider.min}
                  max={slider.max}
                  value={values[slider.key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [slider.key]: Number(e.target.value) }))
                  }
                  aria-label={slider.label}
                  style={{
                    background: `linear-gradient(to right, rgb(var(--c-accent)) ${pct}%, rgb(var(--c-elevated)) ${pct}%)`,
                  }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex w-[104px] shrink-0 flex-col items-center justify-center border-l border-white/10 pl-3 text-center">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted">
            Recommendation
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={result.crop}
              initial={fast ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={fast ? undefined : { opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: fast ? 0 : 0.28 }}
              className="mt-3 rounded-full border border-neon/40 bg-neon/10 px-3 py-1.5 font-mono text-sm font-semibold text-neon shadow-neon"
            >
              {result.crop}
            </motion.span>
          </AnimatePresence>
          <span className="mt-3 font-mono text-[8px] text-muted">
            conf. {Math.round(result.confidence * 100)}%
          </span>
          <div className="mt-2 h-1 w-16 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-neon"
              animate={{ width: `${result.confidence * 100}%` }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Mood → Music ----------------------------- */

const MOODS = ['Happy', 'Sad', 'Angry', 'Disgust', 'Surprise', 'Neutral', 'Fear']
const TRACKS = [
  'Neon Skyline',
  'Afterglow',
  'Paper Planes',
  'Slow Motion',
  'Amber Light',
  'Static Bloom',
]

export function MoodLab() {
  const { fast } = useSettings()
  const [mood, setMood] = useState('Happy')
  const offset = MOODS.indexOf(mood)

  const ranked = TRACKS.map((title, i) => ({
    title,
    score: (0.96 - ((i + offset) % TRACKS.length) * 0.07 - (i % 2) * 0.02).toFixed(2),
  }))
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 3)

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex h-full gap-4">
        <div className="flex w-[122px] shrink-0 flex-col justify-center border-r border-white/10 pr-3">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted">
            Face emotion
          </span>
          <div className="mt-2 flex flex-wrap gap-1">
            {MOODS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                className={`rounded-full border px-2 py-1 font-mono text-[8px] transition-colors ${
                  mood === item
                    ? 'border-neon/70 bg-neon/10 text-neon'
                    : 'border-white/10 text-muted hover:text-warm'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted">
              Spotify match · {mood}
            </span>
            <span className="font-mono text-[8px] text-neon">cosine</span>
          </div>
          <div className="mt-3 space-y-3">
            <AnimatePresence mode="popLayout">
              {ranked.map((track, i) => (
                <motion.div
                  key={track.title}
                  layout={!fast}
                  initial={fast ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={fast ? undefined : { opacity: 0, x: -12 }}
                  transition={{ duration: fast ? 0 : 0.3 }}
                >
                  <div className="flex items-center justify-between font-mono text-[9px]">
                    <span className="truncate text-warm/80">
                      0{i + 1} · {track.title}
                    </span>
                    <span className="text-neon">{track.score}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full bg-neon/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${Number(track.score) * 100}%` }}
                      transition={{ duration: fast ? 0 : 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export const VISUALS = {
  sentiment: SentimentLab,
  memoza: MemozaMatrix,
  crop: CropLab,
  mood: MoodLab,
}
