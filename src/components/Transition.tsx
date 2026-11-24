import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSITIONS, TransitionContext, type Go, type TransitionId } from './transitions';
import { stageLayout } from '../lib/scale';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Block sizes for the mosaic, in game pixels. Multiplied by the screen scale so
// the blocks line up with the pixel art.
const MOSAIC_STEPS = [2, 4, 6, 8, 12, 16, 24];

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<{ id: TransitionId; stage: 'cover' | 'reveal'; key: number } | null>(null);
  const busy = useRef(false);
  const filterRef = useRef<SVGFilterElement>(null);

  // Steps the SVG pixelate filter through block sizes and applies it to the whole app.
  const runMosaic = useCallback((sizes: number[], total: number) => {
    const root = document.getElementById('root');
    const f = filterRef.current;
    if (!root || !f) return;
    const k = stageLayout().scale;
    const [flood, crop, , , dilate] = Array.from(f.children) as SVGElement[];
    const set = (block: number) => {
      const s = Math.round(block * k);
      flood.setAttribute('x', String(Math.floor(s / 2)));
      flood.setAttribute('y', String(Math.floor(s / 2)));
      crop.setAttribute('width', String(s));
      crop.setAttribute('height', String(s));
      dilate.setAttribute('radius', String(Math.floor(s / 2)));
    };
    const step = total / sizes.length;
    sizes.forEach((b, i) => window.setTimeout(() => {
      set(b);
      root.style.filter = 'url(#mosaic)';
    }, i * step));
    window.setTimeout(() => { root.style.filter = ''; }, total);
  }, []);

  const go = useCallback<Go>((to, t = 'fadeBlack') => {
    if (busy.current) return;
    busy.current = true;
    const id: TransitionId = reduceMotion() ? 'fadeBlack' : t;
    const { cover, reveal } = TRANSITIONS[id];
    const key = Date.now();
    setState({ id, stage: 'cover', key });
    if (id === 'mosaic') runMosaic(MOSAIC_STEPS, cover);
    window.setTimeout(() => {
      navigate(to);
      window.scrollTo(0, 0);
      setState({ id, stage: 'reveal', key });
      if (id === 'mosaic') runMosaic([...MOSAIC_STEPS].reverse(), reveal);
      window.setTimeout(() => { setState(null); busy.current = false; }, reveal);
    }, cover);
  }, [navigate, runMosaic]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <filter ref={filterRef} id="mosaic" x="0" y="0" width="100%" height="100%" primitiveUnits="userSpaceOnUse">
          <feFlood x="1" y="1" width="1" height="1" />
          <feComposite width="2" height="2" />
          <feTile result="dots" />
          <feComposite in="SourceGraphic" in2="dots" operator="in" />
          <feMorphology operator="dilate" radius="1" />
        </filter>
      </svg>
      {state && (
        <div key={state.key + state.stage} className={`transition tr-${state.id} ${state.stage}`} aria-hidden>
          {state.id === 'bars' && Array.from({ length: 8 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
          {state.id === 'iris' && <span className="iris-hole" />}
        </div>
      )}
    </TransitionContext.Provider>
  );
}
