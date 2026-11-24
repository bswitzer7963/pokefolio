import { useSyncExternalStore } from 'react';
import { partners } from '../data/portfolio';

const KEY = 'pokefolio-partner';
let id = (() => {
  try { return localStorage.getItem(KEY) ?? partners[0].id; } catch { return partners[0].id; }
})();
const ls = new Set<() => void>();

export function setPartner(next: string) {
  id = next;
  try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
  ls.forEach((l) => l());
}

export function usePartner() {
  const cur = useSyncExternalStore((l) => { ls.add(l); return () => { ls.delete(l); }; }, () => id);
  return partners.find((p) => p.id === cur) ?? partners[0];
}
