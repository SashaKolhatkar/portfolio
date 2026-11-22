# Sasha Kolhatkar // ML Portfolio

An interactive, dark-mode portfolio concept built around **The X-Ray Lens**: an editorial surface layer that reveals neural architecture, source code and model telemetry beneath a cursor-tracked circular mask.

Built with React 18, Vite, Tailwind CSS and Framer Motion. No WebGL — the hero lattice is a hand-rolled 2D canvas projection, tuned to stay at 60fps.

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Interactions

- **X-Ray Lens** — move the cursor over the scan panel to reveal the blueprint layer. Press `P` or use the Surface / Blueprint switch for a full reveal. On touch devices, tap the switch or swipe the panel.
- **Fast Mode** — the toggle in the top bar disables the canvas loop, custom cursor, lens and scroll choreography. The preference is stored in `localStorage` and respects `prefers-reduced-motion`.
- **Tech chips** — hover a chip to trace animated data-flow connectors to the rest of the stack.
- **Project cards** — BatterySense animates a degradation curve, SentimentIQ analyses live text, Memoza sorts cards between quadrants, and Smart Crop updates its recommendation from three sliders. Expand each card for the brief and links.
- **About** — expandable timeline and a GitHub-style contribution activity map.

## Customise

- Content lives in `src/data.js` (projects, timeline, nav links, tech stack).
- Real repositories are wired up in `src/data.js`: SentimentIQ, Memoza, Smart Crop Recommendation and Mood → Music, with live demos where available.
- Theme modes (Dark / Light / Eco) live in `src/context.jsx` and `src/index.css`; Fast Mode remains independent of the theme.
- Résumé is hosted at `public/SashaKolhatkar-Resume.pdf` and linked from both nav bars in `src/components/Nav.jsx` using `import.meta.env.BASE_URL`, so it resolves correctly on GitHub Pages. Replace the file to update your CV.
- Update the contact email in `src/components/Footer.jsx`.
- Colours and fonts are configured in `tailwind.config.js` and `src/index.css`.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`. Set `VITE_BASE` to the repository subpath when deploying to a project Pages site.

Live: https://sashakolhatkar.github.io/portfolio/
