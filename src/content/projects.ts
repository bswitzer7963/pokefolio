import { liveSite, project } from './make';

// Battle projects. Each one is a move; using it on me opens the project's page.
// move.power / accuracy / pp default to 80 / 100 / 10, and the animation is picked from
// the move's type unless you set `animation`. Preview animations and transitions at /animations.
export const projects = [
  project({
    title: 'ECHO',
    move: { name: 'BOOMBURST', type: 'normal', power: 600, accuracy: 50, pp: 1000 },
    transition: 'mosaic',
    featured: true,
    tagline: 'Exploratory Compendium of Humanity Online: Browse 1200+ social media datasets with our extensive analytics visualizations.',
    description: `Social media research is getting harder to reproduce as platforms paywall their APIs and datasets disappear. ECHO collects over 1,200 freely available datasets from 70+ platforms in one place, across graph, text, image, video and GIF data, and hosts most of them directly so they can't vanish. Every dataset comes with precomputed analytics you can explore in the browser without downloading anything: interactive network graphs with Louvain communities, topic clusters, word clouds and readability scores. Search and filters, a list of similar datasets, and the papers that cite each one help researchers find what they need. Everything is precomputed on Syracuse University's HPC cluster. First-author paper in preparation for The Web Conference 2027 (Resource Track), with Prof. Reza Zafarani.`,
    role: 'Designer & lead developer · Data Lab, Syracuse University',
    tech: ['Python', 'Sigma.js', 'Louvain', 'SLURM HPC Cluster'],
    year: '2026–',
    url: 'https://echo.directory',
  }),
  project({
    title: 'Backtest Matrix',
    move: { name: 'FUTURE SIGHT', type: 'psychic', power: 70, accuracy: 80, pp: 120 },
    transition: 'iris',
    tagline: 'Test your Stock, Crypto and ETF portfolios against our past data to recieve a full analysis of how it had performed, and get some insight from our tuned Gemini model!',
    description: `Backtest Matrix allows you to import your stock, crypto, or ETF csv files, or create a new strategy on the spot to be tested against our huge compilation of past data. You will recieve downloadable full analysis that shows your results like your annual return and volatility if you were to actually have used that portfolio for your selected time range. Compare your scores against our leaderboard and get ready for our new predictive measures coming soon!`,
    role: 'Research subgroup co-lead',
    tech: ['Vercel, Vercel Blob, Neon Postgres, Google OAuth, Gemini, Python, React'],
    year: '2026–',
  }),
  project({
    id: 'pig',
    title: 'Pig (MCTS)',
    move: { name: 'ROLLOUT', type: 'rock', category: 'physical', power: 16, accuracy: 90, pp: 100 },
    transition: 'fadeWhite',
    tagline: 'Compete against your friends in the classic game Pig to see whose the biggest high-roller!',
    description: `Play against your friends or my hand coded AI pig Clover to see who is willing to risk it to win! This site is a play on the classic game Pig, where you roll a die as many times as you'd like to risk it, but there is a catch! If you roll a 1, you lose all the points you gained that turn! This AI was hand coded by my friend Abrar Alam and I in the Stony Brook Union to be presented in our AI class.`,
    role: 'Co-developer',
    tech: ['Python'],
    year: '2026',
    url: 'https://pig-u3vt.onrender.com/',
  }),
  project({
    title: 'Almost Apex',
    move: { name: 'SLUDGE', type: 'poison', power: 400, accuracy: 70, pp: 160 },
    transition: 'bars',
    tagline: 'Become the Apex Predator that you deserve to be!',
    description: `Play as a slime (Blob) who didn't quite evolve like all of his peers. You never developed fangs, claws, fins or horns to battle with, so you must collect what you finds in your environment to fight back and become the Apex Predator that you were always supposed to be! This roguelike game was designed by myself and Bryan Wong using Typescript and Stony Brook University's own Wolfie2D Engine. Every bit of the game's art, music, sound effects and UI was created by myself, along with enemy AI, level logic, culling and projectile/enemy management!`,
    role: 'Co-developer · Finalist, 21st Annual Stony Brook Game Programming Competition',
    tech: ['TypeScript', 'Firebase'],
    year: '2025',
    url: 'https://almost-apex.firebaseapp.com/final',
  }),
];

// Other sites I've built. Not part of the battle; listed on the static site.
export const liveSites = [
  liveSite({
    title: 'Tully Market',
    url: 'https://tullymarketny.com',
    description: `A responsive site for my town's local market, with a content schema the owner uses to update it herself.`,
    tech: ['React', 'JavaScript', 'Netlify', 'Sanity'],
    year: '2026',
  }),
  liveSite({
    title: '',
    url: '',
    description: ''
  }),
];
