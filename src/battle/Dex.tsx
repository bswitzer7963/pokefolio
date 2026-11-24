import { useEffect, useRef, useState } from 'react';
import { braden, contacts } from '../data/portfolio';
import { TypePill } from '../components/TypePill';
import { itemIcon } from '../data/assets';
import { Hint } from '../components/Hint';
import { audio } from '../lib/audio';

const CONTACT_ICON: Record<string, string> = {
  email: 'xtransceiver',
  github: 'tm-steel',
  orcid: 'explorer-kit',
  linkedin: 'bicycle',
};

// Hotspots over the Pokédex's bottom bar (x, width), in screen pixels. The bar art is from the B/W Pokédex rip.
const TABS = {
  up: { x: 5, w: 14, hint: 'Scroll the entry up.' },
  down: { x: 29, w: 14, hint: 'Scroll the entry down.' },
  info: { x: 48, w: 31, hint: 'Info: the Pokédex entry.' },
  area: { x: 80, w: 31, hint: 'Area: where to find me (contact links).' },
  cry: { x: 112, w: 31, hint: 'Cry: plays the cry.' },
  forms: { x: 144, w: 31, hint: 'Forms: this portfolio in its other form, a plain website.' },
  close: { x: 211, w: 18, hint: 'Close: back to the title screen.' },
  back: { x: 235, w: 18, hint: 'Back: battle again.' },
} as const;

type Page = 'info' | 'area';

interface Props {
  onBattleAgain: () => void;
  onTitle: () => void;
  onStatic: () => void;
}

export function Dex({ onBattleAgain, onTitle, onStatic }: Props) {
  const [page, setPage] = useState<Page>('info');
  const d = braden.dex;
  const entryRef = useRef<HTMLParagraphElement>(null);

  const press = (tab: keyof typeof TABS) => {
    audio.sfx('select');
    if (tab === 'up' || tab === 'down') entryRef.current?.scrollBy({ top: tab === 'up' ? -16 : 16, behavior: 'smooth' });
    else if (tab === 'info' || tab === 'area') setPage(tab);
    else if (tab === 'cry') audio.sfx('cry');
    else if (tab === 'forms') onStatic();
    else if (tab === 'close') onTitle();
    else onBattleAgain();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || (page === 'info' && ['Enter', 'z', 'Z'].includes(e.key))) setPage('area');
      else if (e.key === 'ArrowLeft') setPage('info');
      else if (['Escape', 'x', 'X'].includes(e.key)) onTitle();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="dex" role="dialog" aria-label="Pokédex">
      <img className="dex-layer" src="/assets/ui/dex/bg.png" alt="" />

      {page === 'info' ? (
        <>
          <img className="dex-layer" src="/assets/ui/dex/panels.png" alt="" />
          <img className="dex-sprite" src={braden.sprite} alt={`${braden.name}, a shiny Quagsire`} />
          <img className="dex-ball" src="/assets/items/poke-ball.png" alt="Caught" />
          <span className="dex-num">{d.number}</span>
          <span className="dex-name">{braden.name}</span>
          <span className="dex-species">{d.species} Pokémon</span>
          <span className="dex-types">{d.types.map((t) => <TypePill key={t} type={t} />)}</span>
          <Hint className="dex-ht" text={d.heightMeaning}><span>HT</span><span>{d.height}</span></Hint>
          <Hint className="dex-wt" text={d.weightMeaning}><span>WT</span><span>{d.weight}</span></Hint>
          <p ref={entryRef} className="dex-entry">{d.entry}</p>
        </>
      ) : (
        <div className="dex-area">
          <div className="dex-area-title frame-dark tabbed">Where to find {braden.name}</div>
          <ul>
            {contacts.map((c) => (
              <li key={c.id}>
                <a className="frame-card" href={c.href} target={c.id === 'email' ? undefined : '_blank'} rel="noopener">
                  <img src={itemIcon(CONTACT_ICON[c.id])} alt="" />
                  <span className="dex-c-label">{c.label}</span>
                  <span className="dex-c-value">{c.value.replace('@', '@​')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <img className="dex-layer" src="/assets/ui/dex/bar.png" alt="" />
      <img className="dex-tabs" src="/assets/ui/dex/tabs.png" alt="" />
      <span className="dex-tab-on" style={{ left: TABS[page].x, width: TABS[page].w, backgroundPositionX: -TABS[page].x }} />
      {page === 'area' && <span className="dex-arrows-off" />}
      {(Object.keys(TABS) as (keyof typeof TABS)[]).map((tab) => (
        <Hint key={tab} className="dex-hot" text={TABS[tab].hint} focusable={false} style={{ left: TABS[tab].x, width: TABS[tab].w }}>
          <button
            type="button"
            aria-label={TABS[tab].hint}
            onClick={() => press(tab)}
          />
        </Hint>
      ))}
    </div>
  );
}
