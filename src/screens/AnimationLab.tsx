import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stage } from '../components/Stage';
import { ANIMATIONS, playMove, type AnimationId } from '../battle/animations';
import { battleBackground } from '../data/assets';
import { TRANSITIONS, useTransitionNav, type TransitionId } from '../components/transitions';
import { braden, projects } from '../data/portfolio';
import { usePartner } from '../lib/partner';

// Unlinked page for previewing attack animations.
export default function AnimationLab() {
  const partner = usePartner();
  const go = useTransitionNav();
  const [current, setCurrent] = useState<AnimationId | null>(null);
  const [loop, setLoop] = useState(false);
  const busy = useRef(false);
  const refs = {
    fx: useRef<HTMLDivElement>(null), bg: useRef<HTMLDivElement>(null), field: useRef<HTMLDivElement>(null),
    player: useRef<HTMLSpanElement>(null), foe: useRef<HTMLSpanElement>(null),
  };

  const play = async (id: AnimationId) => {
    if (busy.current || !refs.fx.current || !refs.bg.current || !refs.field.current || !refs.player.current || !refs.foe.current) return;
    busy.current = true;
    setCurrent(id);
    await playMove(id, { fxLayer: refs.fx.current, bgLayer: refs.bg.current, field: refs.field.current, playerRig: refs.player.current, foeRig: refs.foe.current });
    busy.current = false;
  };

  useEffect(() => {
    if (!loop || !current) return;
    let alive = true;
    const run = async () => { while (alive) { await play(current); await new Promise((r) => setTimeout(r, 500)); } };
    run();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, current]);

  const usedBy = (id: AnimationId) => projects.filter((p) => p.animation === id).map((p) => p.title);

  return (
    <div className="lab">
      <Stage className="battle">
        <div className="scene">
          <div ref={refs.field} className="field" style={{ backgroundImage: `url(${battleBackground()})` }} />
          <div className="foe foe-idle"><span ref={refs.foe} className="rig"><img src={braden.sprite} alt="" /></span></div>
          <div ref={refs.bg} className="fx-bglayer" />
          <div className="player in"><span ref={refs.player} className="rig"><img src={partner.sprite} alt="" /></span></div>
          <div ref={refs.fx} className="fx-layer" />
          <div className="panel"><div className="textbox"><p>{current ? `${partner.name} used ${current.toUpperCase()}!` : 'Pick an animation below.'}</p></div></div>
        </div>
      </Stage>
      <div className="lab-controls">
        <h1>Animation lab</h1>
        <p>Click to play. Set one per project in <code>src/data/portfolio.ts</code> → <code>animation: '…'</code>.</p>
        <label><input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop the selected animation</label>
        <ul>
          {(Object.keys(ANIMATIONS) as AnimationId[]).map((id) => (
            <li key={id}>
              <button type="button" className={current === id ? 'on' : ''} onClick={() => play(id)}>
                <code>{id}</code> <span>{ANIMATIONS[id].label}</span>
                {usedBy(id).length > 0 && <em>used by {usedBy(id).join(', ')}</em>}
              </button>
            </li>
          ))}
        </ul>
        <h2>Transitions</h2>
        <ul>
          {(Object.keys(TRANSITIONS) as TransitionId[]).map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => go('/animations', id)}
              >
                <code>{id}</code> <span>{TRANSITIONS[id].label}</span>
                {projects.some((p) => p.transition === id) && (
                  <em>used by {projects.filter((p) => p.transition === id).map((p) => p.title).join(', ')}</em>
                )}
              </button>
            </li>
          ))}
        </ul>
        <Link to="/">← Title screen</Link>
      </div>
    </div>
  );
}
