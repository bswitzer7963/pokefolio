// Helpers for writing content. Each one takes just the facts and fills in the rest.
import type { AnimationId } from '../battle/animations';
import type { TransitionId } from '../components/transitions';
import type { BagItem, BagPocket, Contact, ContactKind, LiveSite, Move, Partner, PokeType, Project } from './types';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Animation used when a project doesn't pick one.
const defaultAnimation: Partial<Record<PokeType, AnimationId>> = {
  normal: 'boomburst',
  psychic: 'futureSight',
  rock: 'rollout',
  poison: 'sludge',
  ground: 'earthquake',
  electric: 'thunderbolt',
};

interface ProjectInput {
  title: string;
  move: Pick<Move, 'name' | 'type'> & Partial<Move>;
  tagline: string;
  description: string;
  role: string;
  tech: string[];
  year: string;
  url?: string;
  repo?: string;
  image?: string;
  featured?: boolean;
  id?: string; // defaults to the title, e.g. "Backtest Matrix" -> backtest-matrix
  animation?: AnimationId;
  transition?: TransitionId;
}

export function project(p: ProjectInput): Project {
  return {
    ...p,
    id: p.id ?? slug(p.title),
    move: { category: 'special', power: 80, accuracy: 100, pp: 10, ...p.move },
    animation: p.animation ?? defaultAnimation[p.move.type] ?? 'hyperBeam',
    transition: p.transition ?? 'fadeBlack',
  };
}

export function liveSite(s: Pick<LiveSite, 'title' | 'url' | 'description'> & Partial<LiveSite>): LiveSite {
  return { tech: [], year: '', ...s };
}

interface EntryInput {
  title: string; // heading on both versions of the site
  text: string;
  when?: string;
  link?: string;
  item: string; // name in the game's Bag
  icon: string; // public/assets/items/<icon>.png
}

export function entry(e: EntryInput): BagItem {
  return { name: e.item, icon: e.icon, qty: e.when, heading: e.title, description: e.text, href: e.link };
}

export function section(title: string, pocket: string, items: BagItem[]): BagPocket {
  return { id: slug(pocket), label: pocket, section: title, items };
}

const profileUrl: Record<ContactKind, (v: string) => string> = {
  email: (v) => `mailto:${v}`,
  github: (v) => `https://github.com/${v}`,
  orcid: (v) => `https://orcid.org/${v}`,
  linkedin: (v) => `https://www.linkedin.com/in/${v}/`,
};

// `href` is only needed when the link isn't the usual one for that site.
export function contact(kind: ContactKind, value: string, href?: string): Contact {
  return { id: kind, label: kind.toUpperCase(), value, href: href ?? profileUrl[kind](value) };
}

// Expects public/assets/sprites/player-<id>-back.gif and partner-<id>-front.gif.
export function partner(id: string, level = 50): Partner {
  return {
    id,
    name: id.toUpperCase(),
    level,
    sprite: `/assets/sprites/player-${id}-back.gif`,
    front: `/assets/sprites/partner-${id}-front.gif`,
  };
}
