/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0E12',
        panel: '#12141B',
        elevated: '#171A23',
        neon: '#00F0FF',
        warm: '#F3F0E7',
        muted: '#8B93A7',
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
        neon: '0 0 24px rgba(0, 240, 255, 0.22)',
        'neon-lg': '0 0 60px rgba(0, 240, 255, 0.18)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
