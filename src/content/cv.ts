import { entry, section } from './make';

// The CV. On the static site each section is a heading; in the game each one is a
// Bag pocket and each entry an item. Item icons are in public/assets/items.
export const cv = [
  section('Education & Publications', 'KEY ITEMS', [
    entry({
      title: 'Stony Brook University — B.S. in Computer Science',
      text: 'Stony Brook, NY. Aug. 2023 – expected 2027.',
      when: '2023–27',
      item: 'Stony Brook U.',
      icon: 'explorer-kit',
    }),
    entry({
      title: 'ECHO: A Multimodal Social Media Data Web Repository with Advanced Analytics Visualizations',
      text: 'B. Switzer and R. Zafarani. In preparation for The Web Conference 2027 (Resource Track). I am first author.',
      when: 'WWW27',
      item: 'ECHO Paper',
      icon: 'journal',
    }),
    entry({
      title: 'Full CV (PDF)',
      text: 'Download the complete CV.',
      link: '/assets/resume.pdf',
      item: 'My PhD CV',
      icon: 'town-map',
    }),
  ]),

  section('Experience', 'ITEMS', [
    entry({
      title: 'Undergraduate Research Assistant — Data Lab, Syracuse University',
      text: 'Advisor: Prof. Reza Zafarani. Designed and built ECHO (echo.directory), a free catalog of 1,204 social media datasets across 70+ platforms and multiple modalities, with precomputed network metrics, communities, topic models and dataset similarity.',
      when: '2026–',
      item: 'Research Assistant',
      icon: 'dowsing-machine',
    }),
    entry({
      title: 'Substitute Teacher & Class Assistant — Franziska Racker Centers',
      text: 'Support children with and without disabilities in an integrated preschool classroom, adapting to individual needs.',
      when: '2024–',
      item: 'Substitute Teacher for a Special Needs Integrated Preschool',
      icon: 'exp-share',
    }),
    entry({
      title: 'Monitor — New Visions at Onondaga Community College',
      text: 'Provide direct support to adults with disabilities in an annual college-experience program, and plan and run activities with coworkers.',
      when: '2023–',
      item: 'New Visions Monitor',
      icon: 'pal-pad',
    }),
    //OTHER OPTIONS: casteliacone, lava-cookie, big-malasada.
    entry({
      title: 'Prep/Line Cook — The Loft at Vesper Hills',
      text: 'Worked in a high-intensity environment with a chef and a team of cooks to consistently output high-quality dishes',
      when: '2023-2025',
      item: 'Prep Cook',
      icon: 'big-malasada',
    }),
  ]),

  section('Skills', 'TMs', [
    entry({ 
      title: 'Languages',
      text: 'C, Python, JavaScript, TypeScript, Java, Ruby, Bash, HTML/CSS, MIPS',
      item: 'TM01 Languages',
      icon: 'tm-normal'
    }),
    entry({
      title: 'AI, Data & NLP',
      text: 'pandas, scikit-learn, A*, minimax, MCTS, supervised and reinforcement learning, text classification, topic modeling, word embeddings, graph algorithms, community detection',
      item: 'TM02 AI & Data',
      icon: 'tm-psychic',
    }),
    entry({
      title: 'Research Methods',
      text: 'Hand-coding and annotation, sampling and bias, descriptive statistics',
      item: 'TM03 Methods',
      icon: 'tm-grass'
    }),
    entry({
      title: 'Web & Tools',
      text: 'React, Vite, Three.js, Node, Express, REST APIs, MongoDB, Supabase, Neon, Firebase, Git, Vercel',
      item: 'TM04 Web',
      icon: 'tm-electric',
    }),
  ]),

  section('Interests', 'BERRIES', [
    entry({
      title: 'Research interests',
      text: 'Social media data mining and measurement: how communities form and polarize, how sentiment and hate speech can be measured, how far language models can be trusted for that analysis, and the open data that makes results checkable.',
      item: 'Research Interests',
      icon: 'sitrus-berry',
    }),
    entry({
      title: 'Internship Interests (Outside of research)',
      text: 'Software development (Web applications, game development, app development), data ingestion pipelines and visualization, logic code for machine applications',
      item: 'Internship interests',
      icon: 'oran-berry',
    }),
  ]),
];
