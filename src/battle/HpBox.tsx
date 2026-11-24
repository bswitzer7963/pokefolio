import { useEffect, useRef, useState } from 'react';
import { assets } from '../data/assets';
import { Hint } from '../components/Hint';

// Drains (or fills) the displayed HP a point at a time, like the games.
function useDrain(hp: number, msPerPoint = 14) {
  const [shown, setShown] = useState(hp);
  const ref = useRef(hp);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const steps = (now - last) / msPerPoint;
      if (steps >= 1) {
        last = now;
        const cur = ref.current;
        const next = cur > hp ? Math.max(hp, cur - Math.floor(steps)) : Math.min(hp, cur + Math.floor(steps));
        ref.current = next;
        setShown(next);
      }
      if (ref.current !== hp) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hp, msPerPoint]);
  return shown;
}

interface Props {
  side: 'foe' | 'player';
  name: string;
  level: number;
  gender?: string;
  shiny?: boolean;
  hp: number;
  maxHp?: number;
  exp?: number; // 0-100, player only
  visible: boolean;
  caught?: boolean;
  levelHint?: string;
  shinyHint?: string;
}

// The bar art has its fills erased; the HP (48x3) and EXP (80x2) fills are drawn on top so they can animate.
export function HpBox({ side, name, level, gender, shiny, hp, maxHp = 100, exp = 0, visible, caught, levelHint, shinyHint }: Props) {
  const shown = useDrain(hp);
  const pct = Math.max(0, Math.min(100, shown));
  const color = pct > 50 ? 'hp-green' : pct > 20 ? 'hp-yellow' : 'hp-red';
  const cur = Math.round((pct / 100) * maxHp);
  return (
    <div className={`hpbox hpbox-${side} ${visible ? 'in' : ''}`} aria-hidden={!visible}>
      <div className="hpbox-label">
        <span className="hpbox-name">
          {name}
          {caught && <img className="caught-ball" src={assets.ui.pokeBall} alt="" />}
          {shiny && (shinyHint ? <Hint className="shiny-star" text={shinyHint}>★</Hint> : <span className="shiny-star">★</span>)}
        </span>
        <span className="hpbox-lv">
          {gender && <span className={gender === '♀' ? 'g-f' : 'g-m'}>{gender}</span>}
          {levelHint ? (
            <Hint text={levelHint}><img src={assets.ui.lv} alt="Lv" />{level}</Hint>
          ) : (
            <><img src={assets.ui.lv} alt="Lv" />{level}</>
          )}
        </span>
      </div>
      <div className="hpbox-bar">
        <img src={side === 'player' ? assets.ui.hpPlayer : assets.ui.hpFoe} alt="" />
        <span className={`hpbar-fill ${color}`} style={{ width: `${(pct / 100) * 48}px` }} />
        {side === 'player' && (
          <>
            <span className="hpbox-cur">{cur}</span>
            <span className="hpbox-max">{maxHp}</span>
            <span className="expbar-fill" style={{ width: `${(exp / 100) * 80}px` }} />
          </>
        )}
      </div>
    </div>
  );
}
