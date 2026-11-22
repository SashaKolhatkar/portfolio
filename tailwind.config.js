/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: 'rgb(var(--c-bg) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        neon: 'rgb(var(--c-accent) / <alpha-value>)',
        warm: 'rgb(var(--c-text) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        editorial: ['Instrument Serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        neon: '0 0 24px rgb(var(--c-accent) / 0.22)',
        'neon-lg': '0 0 60px rgb(var(--c-accent) / 0.18)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
