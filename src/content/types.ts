import type { AnimationId } from '../battle/animations';
import type { TransitionId } from '../components/transitions';

export type PokeType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'fighting'
  | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost'
  | 'dragon' | 'dark' | 'steel';

export interface Move {
  name: string;
  type: PokeType;
  category: 'physical' | 'special' | 'status';
  power: number;
  accuracy: number;
  pp: number;
}

export interface Project {
  id: string; // used in the URL: /project/<id>
  move: Move;
  animation: AnimationId;
  transition: TransitionId;
  title: string;
  tagline: string;
  description: string;
  role: string;
  tech: string[];
  year: string;
  url?: string;
  repo?: string;
  image?: string;
  featured?: boolean;
}

export interface LiveSite {
  title: string;
  url: string;
  description: string;
  tech: string[];
  year: string;
}

// One CV entry. In the game it's an item in the Bag.
export interface BagItem {
  name: string; // item name in the game's list
  icon: string; // file name in public/assets/items, without .png
  qty?: string; // shown on the right, usually dates
  heading?: string;
  description: string;
  href?: string;
}

// One CV section. In the game it's a Bag pocket.
export interface BagPocket {
  id: string;
  label: string; // pocket name in the game
  section: string; // section title on the static site
  items: BagItem[];
}

export type ContactKind = 'email' | 'github' | 'orcid' | 'linkedin';

export interface Contact {
  id: ContactKind;
  label: string;
  value: string;
  href: string;
}

export interface Partner {
  id: string;
  name: string;
  level: number;
  sprite: string; // back view, used in battle
  front: string; // front view, used on the title screen
}
