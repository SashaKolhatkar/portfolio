export const TECH_STACK = [
  'Python',
  'PyTorch',
  'React',
  'FastAPI',
  'SQL',
  'Scikit-Learn',
]

export const NAV_LINKS = [
  { id: 'hero', label: '01 / INTRO' },
  { id: 'lens', label: '02 / DEEP SCAN' },
  { id: 'work', label: '03 / WORK' },
  { id: 'about', label: '04 / ORIGIN' },
]

/* Real repositories from github.com/SashaKolhatkar are linked here. */
export const PROJECTS = [
  {
    id: 'sentimentiq',
    index: '01',
    title: 'SentimentIQ',
    subtitle: 'Social & customer-review intelligence',
    category: 'NLP / FULL-STACK',
    visual: 'sentiment',
    stack: ['React', 'FastAPI', 'Transformers', 'Scikit-Learn'],
    summary:
      'Analyses pasted comments, uploaded datasets and public pages for sentiment, emotion, suspicion, aspects and trends.',
    detail:
      'Hugging Face RoBERTa models handle sentiment and emotion, with zero-shot evidence checks and TF-IDF/NMF topics. A FastAPI backend stages large uploads to JSONL, runs bounded inference and streams paginated results into a React dashboard with PDF, Excel and CSV export. Includes a 100,000-row end-to-end scale test.',
    metrics: [
      { key: 'HF models', value: '3' },
      { key: 'Exports', value: '3 formats' },
      { key: 'Scale test', value: '100k rows' },
    ],
    demo: '#',
    repo: 'https://github.com/SashaKolhatkar/sentimentiq',
  },
  {
    id: 'memoza',
    index: '02',
    title: 'Memoza',
    subtitle: 'Adaptive planning workspace',
    category: 'FULL-STACK / PRODUCT',
    visual: 'memoza',
    stack: ['React', 'FastAPI', 'SQLAlchemy', 'Scikit-Learn'],
    summary:
      'A calm workspace with an Eisenhower matrix, adaptive scheduling, a focus room and a no-shame restart flow.',
    detail:
      'React 18 + Vite on the front, FastAPI with SQLAlchemy and JWT auth on the back. The scheduler is rule-based first and trains a local scikit-learn duration model only after 20 recorded sessions. Includes four themes, brain dump, progress insights, OAuth calendar import and an offline localStorage workspace.',
    metrics: [
      { key: 'Themes', value: '4' },
      { key: 'Auth', value: 'JWT' },
      { key: 'UI states', value: 'Offline-first' },
    ],
    demo: 'https://memoza-phi-hazel.vercel.app',
    repo: 'https://github.com/SashaKolhatkar/memoza',
  },
  {
    id: 'smart-crop',
    index: '03',
    title: 'Smart Crop Recommendation',
    subtitle: 'Field Lab agritech console',
    category: 'ML / AGRITECH',
    visual: 'crop',
    stack: ['Flask', 'Random Forest', 'HTML/JS', 'Scikit-Learn'],
    summary:
      'Recommends the best crop from soil nutrients and climate readings in a three-theme Field Lab console.',
    detail:
      'Synthetic agronomy data trains a scaled Random Forest with roughly 88% held-out accuracy. The standalone site predicts offline with a rule engine, while the Flask backend serves the trained model at /predict. Includes 22 crop profiles and Light, Dark and Eco themes.',
    metrics: [
      { key: 'Accuracy', value: '~88%' },
      { key: 'Crops', value: '22' },
      { key: 'Themes', value: '3' },
    ],
    demo: 'https://sashakolhatkar.github.io/smart-crop-recommendation/',
    repo: 'https://github.com/SashaKolhatkar/smart-crop-recommendation',
  },
  {
    id: 'mood-music',
    index: '04',
    title: 'Mood → Music',
    subtitle: 'Emotion-driven song recommendation',
    category: 'CV / RECOMMENDER',
    visual: 'mood',
    stack: ['Keras CNN', 'Spotify API', 'Cosine Similarity', 'Pandas'],
    summary:
      'Detects an emotion from a face image, then builds a 40-track Spotify playlist matched to that mood.',
    detail:
      'A face-emotion CNN predicts one of seven emotions from still images or video. A second model labels Spotify tracks as Happy, Sad, Energetic or Calm; content-based filtering builds a playlist vector and ranks tracks by cosine similarity.',
    metrics: [
      { key: 'Emotions', value: '7' },
      { key: 'Music moods', value: '4' },
      { key: 'Playlist', value: '40 tracks' },
    ],
    demo: '#',
    repo: 'https://github.com/SashaKolhatkar/song-reccomendation',
  },
]

export const REPO_LINKS = [
  { label: 'sentimentiq', url: 'https://github.com/SashaKolhatkar/sentimentiq' },
  { label: 'memoza', url: 'https://github.com/SashaKolhatkar/memoza' },
  {
    label: 'smart-crop-recommendation',
    url: 'https://github.com/SashaKolhatkar/smart-crop-recommendation',
  },
  {
    label: 'song-reccomendation',
    url: 'https://github.com/SashaKolhatkar/song-reccomendation',
  },
]

export const TIMELINE = [
  {
    id: 'learning',
    period: '2023 — NOW',
    kind: 'LEARNING',
    title: 'B.Tech in Artificial Intelligence & Machine Learning',
    org: 'SSIPMT',
    blurb:
      'Degree, certifications and continuous hands-on practice in ML and full-stack engineering.',
    details: [
      'Core coursework: Machine Learning, Deep Learning, NLP, Computer Vision, Data Structures, Database Systems.',
      'ML/DL specialisations with applied PyTorch labs and full-stack React/REST development.',
      'Engineering practice: Git, API design, SQL modelling and deployment fundamentals.',
    ],
  },
  {
    id: 'build',
    period: '2025 — NOW',
    kind: 'BUILDING',
    title: 'Shipping intelligent products',
    org: 'Independent',
    blurb:
      'Turning models into interfaces people can actually use.',
    details: [
      'Four end-to-end projects spanning NLP, agritech, productivity and mood-based recommendation.',
      'Focus on latency, observability and interaction design — not just notebooks.',
      'Currently exploring retrieval systems and adaptive interfaces.',
    ],
  },
]
