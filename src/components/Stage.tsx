import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { audio, useSoundOn } from '../lib/audio';
import { HintContext, type ShowHint } from './hintContext';
import { site } from '../data/portfolio';
import { STAGE_H, STAGE_W, stageLayout } from '../lib/scale';

function useLayout() {
  const [layout, setLayout] = useState(() => stageLayout());
  useEffect(() => {
    const onResize = () => setLayout(stageLayout());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return layout;
}

interface Tip { text: string; x: number; y: number; below: boolean }

// The 256x192 game screen, scaled up to fit the window.
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { scale, rails } = useLayout();
  const soundOn = useSoundOn();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const showHint = useCallback<ShowHint>((text, el) => {
    const stage = stageRef.current;
    if (!text || !el || !stage) { setTip(null); return; }
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const k = s.width / STAGE_W;
    const top = (r.top - s.top) / k;
    const bottom = (r.bottom - s.top) / k;
    const below = top < STAGE_H / 2;
    setTip({ text, x: (r.left + r.width / 2 - s.left) / k, y: below ? bottom + 2 : top - 2, below });
  }, []);

  // Keep the hint box inside the screen.
  const tipRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = tipRef.current;
    if (!box || !tip) return;
    const h = box.offsetHeight;
    const top = tip.below ? tip.y : tip.y - h;
    box.style.top = `${Math.max(2, Math.min(top, STAGE_H - h - 2))}px`;
  }, [tip]);

  return (
    <div className={`stage-shell ${rails ? 'with-rails' : ''}`}>
      <div className="stage-rail left">
        <button type="button" className="rail-btn" onClick={() => audio.toggleSound()} aria-pressed={soundOn}>
          <span aria-hidden className={soundOn ? '' : 'off'}>♪</span>{soundOn ? 'Sound on' : 'Sound off'}
        </button>
      </div>
      <div className="stage-rail right">
        <Link className="rail-btn" to="/portfolio"><span aria-hidden>☰</span>Portfolio</Link>
        <a className="rail-btn" href={site.repo} target="_blank" rel="noopener"><span aria-hidden>{'</>'}</span>Source</a>
      </div>
      <div className="stage-frame" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
        <div ref={stageRef} className={`stage ${className}`} style={{ transform: `scale(${scale})` }} onPointerDown={() => setTip(null)}>
          <HintContext.Provider value={showHint}>{children}</HintContext.Provider>
          {tip && (
            <div
              ref={tipRef}
              className="hint-box"
              style={{ left: Math.min(Math.max(tip.x, 92), STAGE_W - 92) }}
              role="tooltip"
            >
              {tip.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
