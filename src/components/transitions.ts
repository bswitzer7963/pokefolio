import { createContext, useContext } from 'react';

// Screen transitions. Each id needs matching .tr-<id>.cover / .reveal rules in transitions.css.
export const TRANSITIONS = {
  fadeWhite: { label: 'Fade to white', cover: 700, reveal: 500 },
  fadeBlack: { label: 'Fade to black', cover: 600, reveal: 500 },
  bars: { label: 'Horizontal blinds', cover: 750, reveal: 600 },
  iris: { label: 'Iris close', cover: 800, reveal: 600 },
  encounter: { label: 'Wild encounter flash', cover: 1300, reveal: 600 },
  mosaic: { label: 'Mosaic dissolve', cover: 650, reveal: 550 },
} as const;
export type TransitionId = keyof typeof TRANSITIONS;

export type Go = (to: string, t?: TransitionId) => void;
export const TransitionContext = createContext<Go>(() => {});
export const useTransitionNav = () => useContext(TransitionContext);
