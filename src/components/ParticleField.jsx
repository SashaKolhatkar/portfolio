import { useEffect, useRef } from 'react'
import { useSettings, usePointer } from '../context'

/**
 * Lightweight 2D canvas lattice with a hand-rolled 3D projection.
 * No WebGL, no heavy libraries — ~190 instanced-style nodes at 60fps.
 */
export default function ParticleField() {
  const canvasRef = useRef(null)
  const { fast } = useSettings()
  const { raw } = usePointer()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const NX = 9
    const NY = 7
    const NZ = 3
    const nodes = []
    for (let z = 0; z < NZ; z += 1) {
      for (let y = 0; y < NY; y += 1) {
        for (let x = 0; x < NX; x += 1) {
          nodes.push({
            ix: x,
            iy: y,
            iz: z,
            x: (x - (NX - 1) / 2) / ((NX - 1) / 2),
            y: (y - (NY - 1) / 2) / ((NY - 1) / 2),
            z: z - (NZ - 1) / 2,
            seed: ((x * 13 + y * 7 + z * 5) % 17) / 17,
          })
        }
      }
    }

    const edges = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]
        const b = nodes[j]
        const vertical =
          a.ix === b.ix && a.iy === b.iy && Math.abs(a.iz - b.iz) === 1
        const row =
          a.ix === b.ix && a.iz === b.iz && Math.abs(a.iy - b.iy) === 1
        const col =
          a.iy === b.iy && a.iz === b.iz && Math.abs(a.ix - b.ix) === 1
        if (vertical || row || col) edges.push([i, j])
      }
    }

    let raf = 0
    let width = 0
    let height = 0
    let visible = true
    let clock = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (fast) draw(0)
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height)

      const rotY = fast
        ? -0.18
        : (raw.current.x - 0.5) * 1.1 + Math.sin(time * 0.00018) * 0.12
      const rotX = fast
        ? 0.12
        : (raw.current.y - 0.5) * -0.55 + Math.cos(time * 0.00022) * 0.06

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cx = width * 0.56
      const cy = height * 0.5
      const unit = Math.min(width * 0.36, height * 0.4)

      const pts = nodes.map((n) => {
        const rx = n.x * cosY - n.z * sinY
        let rz = n.x * sinY + n.z * cosY
        const ry = n.y * cosX - rz * sinX
        rz = n.y * sinX + rz * cosX
        const persp = 2.6 / (2.6 + rz * 0.55)
        return {
          sx: cx + rx * unit * persp,
          sy: cy + ry * unit * 0.86 * persp,
          depth: rz,
        }
      })

      // Connecting edges
      ctx.lineWidth = 1
      for (let k = 0; k < edges.length; k += 1) {
        const p = pts[edges[k][0]]
        const q = pts[edges[k][1]]
        const depth = (p.depth + q.depth) / 2
        const alpha = 0.035 + Math.max(0, depth) * 0.075
        ctx.strokeStyle = `rgba(0,240,255,${alpha})`
        ctx.beginPath()
        ctx.moveTo(p.sx, p.sy)
        ctx.lineTo(q.sx, q.sy)
        ctx.stroke()
      }

      // Nodes + a handful of brighter "training" nodes
      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i]
        const pulse = fast ? 0.5 : 0.5 + 0.5 * Math.sin(time * 0.0015 + nodes[i].seed * 9)
        const front = Math.max(0, p.depth)
        const radius = 0.9 + front * 0.9 + pulse * 0.45

        if (nodes[i].seed > 0.86) {
          ctx.fillStyle = `rgba(0,240,255,${0.035 + pulse * 0.035})`
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, radius * 5.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(0,240,255,${0.2 + front * 0.35 + pulse * 0.2})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Axis crosshair
      ctx.strokeStyle = 'rgba(0,240,255,0.11)'
      ctx.setLineDash([2, 7])
      ctx.beginPath()
      ctx.moveTo(cx - unit * 1.25, cy)
      ctx.lineTo(cx + unit * 1.25, cy)
      ctx.moveTo(cx, cy - unit * 1.1)
      ctx.lineTo(cx, cy + unit * 1.1)
      ctx.stroke()
      ctx.setLineDash([])
    }

    const loop = (time) => {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)

    let observer
    if (!fast && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          cancelAnimationFrame(raf)
          if (visible) raf = requestAnimationFrame(loop)
        },
        { threshold: 0.01 },
      )
      observer.observe(canvas)
      raf = requestAnimationFrame(loop)
    } else if (!fast) {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      observer?.disconnect()
    }
  }, [fast, raw])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
      aria-hidden="true"
    />
  )
}
