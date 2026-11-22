import { useRef, useState } from 'react'
import { AnimatePresence, motion, useSpring } from 'framer-motion'
import { PROJECTS, REPO_LINKS } from '../data'
import { useSettings } from '../context'
import { VISUALS } from './ProjectVisuals'
import { Icon, Reveal, SectionTitle, Tag } from './ui'

function ProjectCard({ project, index }) {
  const { fast } = useSettings()
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  const rotateX = useSpring(0, { stiffness: 180, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 20 })
  const Visual = VISUALS[project.visual]

  const onMove = (event) => {
    if (fast || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 9)
    rotateX.set((0.5 - py) * 9)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <Reveal delay={index * 0.08}>
      <motion.article style={{ perspective: 1200 }} className="h-full">
        <motion.div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={reset}
          style={
            fast
              ? undefined
              : { rotateX, rotateY, transformStyle: 'preserve-3d' }
          }
          className="panel group relative flex h-full flex-col rounded-2xl p-5 transition-colors duration-500 hover:border-neon/25 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-neon">
                {project.index} / {String(PROJECTS.length).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-warm sm:text-[26px]">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
            </div>
            <span className="mono-label shrink-0 text-[8px] text-right">
              {project.category}
            </span>
          </div>

          <div className="mt-6">
            <Visual />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-6 flex w-full items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-neon"
          >
            {open ? 'Close brief' : 'Read the brief'}
            <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-neon">
              <Icon name="plus" size={16} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: fast ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-5">
                  <p className="text-sm leading-relaxed text-warm/75">
                    {project.detail}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric.key}
                        className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-3"
                      >
                        <div className="font-mono text-[8px] uppercase tracking-wider text-muted">
                          {metric.key}
                        </div>
                        <div className="mt-1.5 font-mono text-sm text-neon">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.demo !== '#' ? (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary !px-4 !py-2 !text-[10px]"
                      >
                        Live demo <Icon name="external" size={13} />
                      </a>
                    ) : (
                      <span className="btn-primary cursor-not-allowed !px-4 !py-2 !text-[10px] opacity-40">
                        Live demo <Icon name="external" size={13} />
                      </span>
                    )}
                    {project.repo !== '#' ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost !px-4 !py-2 !text-[10px]"
                      >
                        GitHub repo <Icon name="github" size={13} />
                      </a>
                    ) : (
                      <span className="btn-ghost cursor-not-allowed !px-4 !py-2 !text-[10px] opacity-40">
                        GitHub repo <Icon name="github" size={13} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.article>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionTitle
          index="03"
          kicker="SELECTED WORK"
          title="Systems in"
          accent="the wild."
          description="Four projects where models meet interfaces. Each card is live — type, sort and slide to see the behaviour, not just the screenshot."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
          <span className="mono-label flex items-center gap-2 text-[9px] text-neon">
            <Icon name="github" size={14} /> More on GitHub
          </span>
          {REPO_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] text-muted transition-colors hover:text-neon"
            >
              ↗ {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
