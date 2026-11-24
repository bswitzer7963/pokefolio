import { contact, partner } from './make';
import type { PokeType } from './types';

export const site = {
  title: 'Braden — Portfolio',
  headline: 'Braden',
  subhead: 'Social media data mining & measurement · CS at Stony Brook University',
  intro: 'I\'m a Computer Science student at Stony Brook. My biggest project is ECHO, a research data repository built for Syracuse University that gives researchers a single hub for over 1,200 open-access social media datasets. I wrote the Python ingestion pipeline on the Data Lab\'s SLURM Linux cluster and built the frontend visualizations, including word clusters and dynamic network graphs. I\'ve also built a TypeScript roguelite game with a class partner and deployed a full-stack React site for a local market owner. Most of what I know came from breaking something in one of these and then having to explain why. Outside of code, I worked as a direct support professional for individuals with developmental disabilities. That job taught me to read a room, stay patient, and communicate clearly, which turns out to matter just as much on a team. I\'m looking for a Summer 2027 software engineering internship.',
  catchLine: 'Gotcha! You caught my attention!',
  cv: '/assets/resume.pdf',
  repo: 'https://github.com/bswitzer7963/pokefolio',
};

export const contacts = [
  contact('email', 'switzerbraden79@gmail.com'),
  contact('github', 'bswitzer7963'),
  contact('orcid', '0009-0006-2291-004X'),
  contact('linkedin', 'braden-switzer', 'https://www.linkedin.com/in/braden-switzer-771090410/'),
];

// Who the visitor can play as. With one entry the picker is greyed out.
export const partners = [partner('gengar'), partner('serperior'), partner('emboar'), partner('samurott')];

// Milestones shown as the "Badges" count on the title screen. Hover lists them.
const badges = [
  'Game Programming Competition finalist (Almost Apex)',
  'First-author paper, in prep. for WWW 2027 (ECHO)',
];

// "Time" on the save file counts up from this date.
const startedCS = new Date(2023, 7); // Aug 2023

function playTime(now = new Date()) {
  const months = (now.getFullYear() - startedCS.getFullYear()) * 12 + now.getMonth() - startedCS.getMonth();
  return `${Math.floor(months / 12)}:${String(months % 12).padStart(2, '0')}`;
}

export const braden = {
  name: 'BRADEN',
  level: 21,
  levelMeaning: 'Lv: My Age',
  gender: '♂' as '♂' | '♀' | '',
  shiny: true,
  shinyMeaning: 'Shiny: one of a kind.',
  sprite: '/assets/sprites/braden-quagsire-shiny.gif',
  dex: {
    number: '195',
    species: 'Computer Scientist',
    types: ['electric', 'fighting'] as PokeType[],
    height: '4\'',
    heightMeaning: 'HT: year I am in college',
    weight: '3.3\'',
    weightMeaning: 'WT: my GPA at Stony Brook University',
    entry:
      'I\'m a Computer Science student at Stony Brook. My biggest project is ECHO, a research data repository built for Syracuse University that gives researchers a single hub for over 1,200 open-access social media datasets. I wrote the Python ingestion pipeline on the Data Lab\'s SLURM Linux cluster and built the frontend visualizations, including word clusters and dynamic network graphs. I\'ve also built a TypeScript roguelite game with a class partner and deployed a full-stack React site for a local market owner. Most of what I know came from breaking something in one of these and then having to explain why. Outside of code, I worked as a direct support professional for individuals with developmental disabilities. That job taught me to read a room, stay patient, and communicate clearly, which turns out to matter just as much on a team. I\'m looking for a Summer 2027 software engineering internship.',
  },
  save: {
    subtitle: 'The Computer Scientist Pokemon',
    badges,
    time: playTime(),
    timeMeaning: 'Time: years and months since I started my CS degree (Aug. 2023).',
    pokedexMeaning: 'Pokédex: number of projects in this portfolio.',
  },
};

// Hover text for game terms, so nothing on screen is an unexplained Pokémon joke.
export const typeMeaning: Partial<Record<PokeType, string>> = {
  normal: 'Normal type: research infrastructure that a bit of everything depends on.',
  psychic: 'Psychic type: forecasting and data analysis.',
  rock: 'Rock type: classic AI and search algorithms.',
  poison: 'Poison type: games that rot your brain lol.',
};

export const statMeaning = {
  power: 'POW: rough amount of time I personally spent on the project.',
  accuracy: 'ACC: how finished it is. 100 means shipped and in use.',
  pp: 'PP: how reusable this piece is.',
  category: 'Physical / Special: whether it is hands-on building or research-heavy.',
};
