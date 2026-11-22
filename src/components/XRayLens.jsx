import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSettings } from '../context'
import { BlinkDot, Icon, SectionTitle } from './ui'

/* ----------------------------- shared layout ----------------------------- */

const LAYER_GRID =
  'absolute inset-0 grid grid-cols-1 gap-px p-px md:grid-cols-3'

/* ------------------------------ editorial -------------------------------- */

function EditorialCell({ number, title, body, children }) {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[rgb(var(--c-editorial))] p-7 text-[#0D0E12] sm:p-9">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#0D0E12]/50">
          Surface / {number}
        </span>
        <span className="font-mono text-[9px] text-[#0D0E12]/30">FIG. 0{number}</span>
      </div>
      <h3 className="mt-10 max-w-[16ch] font-editorial text-4xl leading-[1.02] sm:text-5xl">
        {title}
      </h3>
      <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-[#0D0E12]/60">
        {body}
      </p>
      <div className="mt-auto pt-8">{children}</div>
    </div>
  )
}

function ConcentricArt() {
  return (
    <svg viewBox="0 0 300 110" className="h-24 w-full" aria-hidden="true">
      {[18, 34, 50, 66].map((r) => (
        <circle
          key={r}
          cx="150"
          cy="55"
          r={r}
          fill="none"
          stroke="#0D0E12"
          strokeOpacity={0.1 + r / 500}
          strokeWidth="1"
        />
      ))}
      <line x1="0" y1="55" x2="300" y2="55" stroke="#0D0E12" strokeOpacity="0.16" />
      <line x1="150" y1="0" x2="150" y2="110" stroke="#0D0E12" strokeOpacity="0.16" />
      <circle cx="184" cy="55" r="4" fill="#00A8B5" />
    </svg>
  )
}

function StackArt() {
  return (
    <div className="space-y-2">
      {[
        ['PRIORITY / 01', '82%'],
        ['PRIORITY / 02', '54%'],
        ['PRIORITY / 03', '31%'],
      ].map(([label, value], i) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-[76px] shrink-0 font-mono text-[8px] tracking-wider text-[#0D0E12]/45">
            {label}
          </span>
          <div className="h-1.5 flex-1 bg-[#0D0E12]/10">
            <div
              className="h-full bg-[#0D0E12]/60"
              style={{ width: value, transform: `translateX(${i * 6}px)` }}
            />
          </div>
          <span className="font-mono text-[8px] text-[#0D0E12]/45">{value}</span>
        </div>
      ))}
    </div>
  )
}

function WaveArt() {
  return (
    <div className="flex h-24 items-end gap-1">
      {Array.from({ length: 36 }, (_, i) => {
        const h = 18 + Math.abs(Math.sin(i * 0.62)) * 70
        return (
          <span
            key={i}
            className="flex-1 bg-[#0D0E12]/50"
            style={{ height: `${h}%`, opacity: 0.25 + (i % 5) * 0.12 }}
          />
        )
      })}
    </div>
  )
}

function EditorialLayer({ hidden }) {
  return (
    <div
      className={`${LAYER_GRID} bg-[rgb(var(--c-editorial-gap))] ${hidden ? 'invisible' : ''}`}
      aria-hidden={hidden}
    >
      <EditorialCell
        number="1"
        title="Good interfaces hide their machinery."
        body="What feels effortless on screen is usually the result of a thousand small decisions underneath."
      >
        <ConcentricArt />
      </EditorialCell>
      <EditorialCell
        number="2"
        title="Built for the messy middle."
        body="Real data is late, noisy and incomplete. The interesting engineering happens in that gap."
      >
        <StackArt />
      </EditorialCell>
      <EditorialCell
        number="3"
        title="Every system has a pulse."
        body="Metrics are not paperwork. They are the heartbeat that tells you whether a model is alive."
      >
        <WaveArt />
      </EditorialCell>
    </div>
  )
}

/* ------------------------------- blueprint ------------------------------- */

function NeuralNet({ fast }) {
  const widths = [3, 5, 4, 2]
  const xs = [42, 124, 206, 288]
  const layers = widths.map((count, li) =>
    Array.from({ length: count }, (_, i) => ({
      x: xs[li],
      y: count === 1 ? 90 : 34 + (i * 112) / (count - 1),
    })),
  )

  const edges = []
  layers.slice(0, -1).forEach((from, li) => {
    from.forEach((a, ai) => {
      layers[li + 1].forEach((b, bi) => {
        edges.push({ key: `${li}-${ai}-${bi}`, a, b, li, ai, bi })
      })
    })
  })

  return (
    <div className="relative mt-7 flex-1">
      <svg viewBox="0 0 330 170" className="h-full min-h-[170px] w-full">
        <defs>
          <linearGradient id="net-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {edges.map((edge) => (
          <line
            key={edge.key}
            x1={edge.a.x}
            y1={edge.a.y}
            x2={edge.b.x}
            y2={edge.b.y}
            stroke="url(#net-line)"
            strokeWidth="0.8"
          />
        ))}
        {edges
          .filter((e) => (e.ai + e.bi + e.li) % 4 === 0)
          .slice(0, 8)
          .map((edge) => (
            <motion.line
              key={`pulse-${edge.key}`}
              x1={edge.a.x}
              y1={edge.a.y}
              x2={edge.b.x}
              y2={edge.b.y}
              stroke="#00F0FF"
              strokeWidth="1.6"
              strokeDasharray="5 40"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: fast ? 0 : -45 }}
              transition={{
                duration: 1.6,
                repeat: fast ? 0 : Infinity,
                ease: 'linear',
                delay: (edge.ai % 3) * 0.2,
              }}
            />
          ))}
        {layers.flatMap((layer, li) =>
          layer.map((node, ni) => (
            <g key={`n-${li}-${ni}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={li === 3 ? 7 : 5.5}
                fill="#061216"
                stroke="#00F0FF"
                strokeOpacity={0.35 + li * 0.15}
                strokeWidth="1.2"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="1.8"
                fill="#00F0FF"
                fillOpacity={0.5 + ((li + ni) % 3) * 0.2}
              />
            </g>
          )),
        )}
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[8px] uppercase tracking-widest text-neon/40">
        <span>Input · 3</span>
        <span>Hidden ×2</span>
        <span>Output · 2</span>
      </div>
    </div>
  )
}

const CODE_LINES = [
  <><span className="text-[#7C869E]">import</span> torch</>,
  <><span className="text-[#7C869E]">from</span> fastapi <span className="text-[#7C869E]">import</span> FastAPI</>,
  <br />,
  <><span className="text-neon">class</span> <span className="text-[#F3F0E7]">HealthNet</span>(nn.Module):</>,
  <>&nbsp;&nbsp;<span className="text-neon">def</span> forward(self, x):</>,
  <>&nbsp;&nbsp;&nbsp;&nbsp;x = F.relu(self.fc1(x))</>,
  <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#E9B872]">return</span> self.head(x)</>,
  <br />,
  <><span className="text-[#7C869E]">@app.post</span>(<span className="text-[#9BE88F]">&quot;/infer&quot;</span>)</>,
  <><span className="text-neon">def</span> infer(payload: Telemetry):</>,
  <>&nbsp;&nbsp;<span className="text-[#E9B872]">return</span> model.predict(payload)</>,
]

function CodeBlock() {
  return (
    <div className="relative mt-7 flex-1 overflow-hidden rounded-lg border border-neon/15 bg-black/30">
      <div className="flex items-center justify-between border-b border-neon/10 px-3 py-2">
        <span className="font-mono text-[8px] uppercase tracking-widest text-neon/60">
          inference.py
        </span>
        <div className="flex gap-1">
          {['#FF6B6B', '#E9B872', '#00F0FF'].map((c) => (
            <span
              key={c}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: c, opacity: 0.7 }}
            />
          ))}
        </div>
      </div>
      <pre className="overflow-hidden px-3 py-3 font-mono text-[9px] leading-[1.65] text-[#C7D2E0] sm:text-[10px]">
        {CODE_LINES.map((line, i) => (
          <div key={i} className="flex gap-3 whitespace-pre">
            <span className="select-none text-neon/25">{String(i + 1).padStart(2, '0')}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  )
}

function Telemetry({ fast }) {
  const data = [0.92, 0.84, 0.79, 0.71, 0.74, 0.62, 0.55, 0.58, 0.47, 0.41, 0.35, 0.37, 0.28, 0.22, 0.18, 0.14]
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 300},${12 + (1 - v) * 88}`)
  const line = `M ${points.join(' L ')}`
  const area = `${line} L 300 110 L 0 110 Z`

  return (
    <div className="mt-7 flex flex-1 flex-col">
      <div className="relative h-28 w-full rounded border border-neon/10 bg-black/25">
        <div className="grid-fine pointer-events-none absolute inset-0 opacity-30" />
        <svg viewBox="0 0 300 110" className="relative h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="loss-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#loss-fill)" />
          <motion.path
            d={line}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1.6"
            initial={fast ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: fast ? 0 : 1.3, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute right-2 top-1 font-mono text-[8px] text-neon/50">
          LOSS ↓
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-px bg-neon/10">
        {[
          ['EPOCH', '42/60'],
          ['VAL_ACC', '0.971'],
          ['LR', '3e-4'],
        ].map(([k, v]) => (
          <div key={k} className="bg-[#061216] px-2 py-3">
            <div className="font-mono text-[8px] tracking-widest text-neon/40">{k}</div>
            <div className="mt-1 font-mono text-sm text-[#F3F0E7]">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[
          ['GPU UTIL', '87%'],
          ['BATCH', '64'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-16 font-mono text-[8px] text-neon/40">{k}</span>
            <div className="h-1 flex-1 bg-white/10">
              <motion.div
                className="h-full bg-neon/70"
                initial={{ width: 0 }}
                whileInView={{ width: v }}
                viewport={{ once: true }}
                transition={{ duration: fast ? 0 : 1 }}
              />
            </div>
            <span className="font-mono text-[8px] text-neon/70">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlueprintCell({ number, title, children }) {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[#061216] p-7 text-[#F3F0E7] sm:p-9">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-25" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neon/70">
          Blueprint / {number}
        </span>
        <span className="font-mono text-[9px] text-neon/30">DEPTH 1.00</span>
      </div>
      <h3 className="relative mt-10 font-mono text-lg font-medium tracking-tight text-neon">
        {title}
      </h3>
      {children}
      <div className="relative mt-5 flex items-center gap-2 border-t border-neon/15 pt-3">
        <BlinkDot />
        <span className="font-mono text-[8px] uppercase tracking-widest text-neon/50">
          Signal verified
        </span>
      </div>
    </div>
  )
}

function BlueprintLayer({ fast }) {
  return (
    <div className={`${LAYER_GRID} bg-neon/10`}>
      <BlueprintCell number="1" title="architecture.forward()">
        <NeuralNet fast={fast} />
      </BlueprintCell>
      <BlueprintCell number="2" title="inference_pipeline.py">
        <CodeBlock />
      </BlueprintCell>
      <BlueprintCell number="3" title="model_telemetry">
        <Telemetry fast={fast} />
      </BlueprintCell>
    </div>
  )
}

/* -------------------------------- lens ring ------------------------------- */

function LensRing({ lx, ly, active }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-40"
      style={{ left: lx, top: ly }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="relative h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/60 shadow-[0_0_45px_rgba(0,240,255,0.22),inset_0_0_40px_rgba(0,240,255,0.08)]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.07),transparent_70%)]" />
        <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-neon/20" />
        <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-neon/20" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon" />
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-neon">
          X-Ray // Scanning
        </span>
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-neon/60">
          Depth 1.00 · 00F0FF
        </span>
      </div>
    </motion.div>
  )
}

/* --------------------------------- section -------------------------------- */

export default function XRayLens() {
  const { fast } = useSettings()
  const rootRef = useRef(null)
  const touchStart = useRef(0)
  const lx = useMotionValue(0)
  const ly = useMotionValue(0)
  const sx = useSpring(lx, { stiffness: 420, damping: 32, mass: 0.4 })
  const sy = useSpring(ly, { stiffness: 420, damping: 32, mass: 0.4 })

  const [active, setActive] = useState(false)
  const [simple, setSimple] = useState(false)
  const [showBlueprint, setShowBlueprint] = useState(false)
  const [fullReveal, setFullReveal] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setSimple(query.matches || window.innerWidth < 768)
    update()
    query.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      query.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === 'p' && !simple) {
        setFullReveal((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [simple])

  const track = (event) => {
    if (!rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    rootRef.current.style.setProperty('--lens-x', `${x}px`)
    rootRef.current.style.setProperty('--lens-y', `${y}px`)
    lx.set(x)
    ly.set(y)
  }

  const lensMode = !simple && !fast

  return (
    <section id="lens" className="relative overflow-hidden py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="section-shell relative">
        <SectionTitle
          index="02"
          kicker="DEEP SCAN"
          title="Look closer."
          accent="Look deeper."
          description="The surface layer is the story. Move the lens across it to expose the architecture, code and telemetry doing the work underneath."
        />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="scan" size={15} className="text-neon" />
            <span className="mono-label text-warm/70">
              {lensMode
                ? 'Move cursor to scan · press P for full reveal'
                : 'Tap a layer or swipe to switch views'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              {[
                { label: 'Surface', value: false },
                { label: 'Blueprint', value: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() =>
                    lensMode
                      ? setFullReveal(option.value)
                      : setShowBlueprint(option.value)
                  }
                  className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    (lensMode ? fullReveal : showBlueprint) === option.value
                      ? 'bg-neon text-obsidian'
                      : 'text-muted hover:text-warm'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="mono-label hidden text-[9px] sm:block">
              {fast ? 'Fast mode' : lensMode ? 'Lens active' : 'Touch mode'}
            </span>
          </div>
        </div>

        <div
          ref={rootRef}
          className={`xray-root relative h-[1180px] overflow-hidden rounded-2xl border border-white/10 bg-obsidian shadow-2xl md:h-[660px] ${
            active ? '' : 'scan-idle'
          } ${fullReveal || !lensMode ? 'xray-full' : ''}`}
          onPointerMove={lensMode ? track : undefined}
          onPointerEnter={() => lensMode && setActive(true)}
          onPointerLeave={() => lensMode && setActive(false)}
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - touchStart.current
            if (Math.abs(delta) > 60) setShowBlueprint(delta < 0)
          }}
        >
          <EditorialLayer hidden={!lensMode && showBlueprint} />
          <div
            className={`xray-layer absolute inset-0 ${
              lensMode || showBlueprint ? '' : 'invisible'
            }`}
          >
            <BlueprintLayer fast={fast} />
          </div>
          {lensMode && <LensRing lx={sx} ly={sy} active={active} />}

          <div className="pointer-events-none absolute bottom-3 left-3 z-50 flex items-center gap-2 rounded-full border border-neon/20 bg-obsidian/70 px-3 py-1.5 backdrop-blur">
            <BlinkDot />
            <span className="font-mono text-[9px] uppercase tracking-widest text-neon/80">
              {lensMode
                ? active
                  ? 'Scanning under the surface'
                  : 'Surface layer // depth 0.00'
                : showBlueprint
                  ? 'Blueprint layer // depth 1.00'
                  : 'Surface layer // depth 0.00'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
