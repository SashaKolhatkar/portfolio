import { MotionConfig } from 'framer-motion'
import { PointerProvider, SettingsProvider, useSettings } from './context'
import Nav from './components/Nav'
import Hero from './components/Hero'
import XRayLens from './components/XRayLens'
import Projects from './components/Projects'
import About from './components/About'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

function Experience() {
  const { fast } = useSettings()

  return (
    <MotionConfig reducedMotion={fast ? 'always' : 'user'}>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-neon focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-obsidian"
      >
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <XRayLens />
        <Projects />
        <About />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <PointerProvider>
        <Experience />
      </PointerProvider>
    </SettingsProvider>
  )
}
