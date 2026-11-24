import { createContext } from 'react';

export type ShowHint = (text: string | null, el?: HTMLElement) => void;
export const HintContext = createContext<ShowHint>(() => {});
