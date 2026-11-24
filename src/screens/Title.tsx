import { useEffect, useState } from 'react';
import { Stage } from '../components/Stage';
import { useTransitionNav } from '../components/transitions';
import { braden, partners, projects } from '../data/portfolio';
import { assets } from '../data/assets';
import { audio } from '../lib/audio';
import { setPartner, usePartner } from '../lib/partner';
import { Hint } from '../components/Hint';

export default function Title() {
  const go = useTransitionNav();
  const partner = usePartner();
  const [sel, setSel] = useState(0);
  const canPick = partners.length > 1;
  const options = canPick ? 3 : 2;
  const [hours, minutes = ''] = braden.save.time.split(':');

  // starts on the first click or key press
  useEffect(() => { audio.playMusic('title'); }, []);

  const cyclePartner = (d: number) => {
    if (!canPick) return;
    const i = partners.findIndex((p) => p.id === partner.id);
    setPartner(partners[(i + d + partners.length) % partners.length].id);
    audio.sfx('cursor');
  };

  const choose = (i: number) => {
    if (i === 2) { cyclePartner(1); return; }
    audio.sfx('select');
    audio.stopMusic();
    if (i === 0) go('/battle', 'encounter');
    else go('/portfolio', 'fadeWhite');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { audio.sfx('cursor'); setSel((s) => (s + 1) % options); }
      else if (e.key === 'ArrowUp') { audio.sfx('cursor'); setSel((s) => (s - 1 + options) % options); }
      else if (sel === 2 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) cyclePartner(e.key === 'ArrowLeft' ? -1 : 1);
      else if (['Enter', 'z', 'Z', ' '].includes(e.key)) choose(sel);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const hover = (i: number) => () => { if (i !== sel) { setSel(i); } };

  return (
    <Stage className="title">
      <div className="title-bg" aria-hidden />
      <h1 className="sr-only">Braden's portfolio — choose how to explore</h1>

      <div className="save-panel" aria-label="Saved game">
        <img src={assets.ui.savePanel} alt="" />
        <span className="sp-name">{braden.name}</span>
        <span className="sp-sub">{braden.save.subtitle}</span>
        <Hint className="sp-badges" text={`Badges: milestones so far.\n${braden.save.badges.map((b) => `· ${b}`).join('\n')}`}>
          {braden.save.badges.length}
        </Hint>
        <Hint className="sp-dex" text={braden.save.pokedexMeaning}>{projects.length}</Hint>
        <Hint className="sp-time" text={braden.save.timeMeaning}>
          <span className="sp-hours">{hours}</span>
          <span className="sp-minutes">{minutes}</span>
        </Hint>
      </div>

      <div className="menu-bars">
        <button type="button" className={`menu-bar ${sel === 0 ? 'sel' : ''}`} onMouseEnter={hover(0)} onFocus={hover(0)} onClick={() => choose(0)}>
          CONTINUE
        </button>
        <button type="button" className={`menu-bar ${sel === 1 ? 'sel' : ''}`} onMouseEnter={hover(1)} onFocus={hover(1)} onClick={() => choose(1)}>
          VIEW STATIC WEBSITE
        </button>
        <div
          className={`menu-bar menu-partner ${sel === 2 ? 'sel' : ''} ${canPick ? '' : 'disabled'}`}
          onMouseEnter={() => canPick && setSel(2)}
          aria-disabled={!canPick}
        >
          <span>PARTNER</span>
          <span className="partner-pick">
            <button type="button" disabled={!canPick} onClick={() => cyclePartner(-1)} onFocus={() => setSel(2)} aria-label="Previous partner">◀</button>
            <span className="partner-name">{partner.name}</span>
            <button type="button" disabled={!canPick} onClick={() => cyclePartner(1)} onFocus={() => setSel(2)} aria-label="Next partner">▶</button>
          </span>
        </div>
      </div>

      <div className={`partner-preview ${canPick ? '' : 'disabled'}`} aria-hidden>
        <img key={partner.id} src={partner.front} alt="" />
      </div>
    </Stage>
  );
}
