import { useEffect, useRef, useState } from 'react';
import { bag } from '../data/portfolio';
import { itemIcon } from '../data/assets';
import { audio } from '../lib/audio';

export function Bag({ onClose }: { onClose: () => void }) {
  const [pocket, setPocket] = useState(0);
  const [item, setItem] = useState(0);
  const [frame, setFrame] = useState(0);
  const timers = useRef<number[]>([]);
  const p = bag[pocket];
  const it = p.items[item];

  const switchPocket = (d: number) => {
    audio.sfx('select');
    setPocket((x) => (x + d + bag.length) % bag.length);
    setItem(0);
    timers.current.forEach(clearTimeout);
    setFrame(1);
    timers.current = [window.setTimeout(() => setFrame(2), 90), window.setTimeout(() => setFrame(0), 260)];
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') switchPocket(-1);
      else if (e.key === 'ArrowRight') switchPocket(1);
      else if (e.key === 'ArrowUp') setItem((i) => Math.max(0, i - 1));
      else if (e.key === 'ArrowDown') setItem((i) => Math.min(p.items.length - 1, i + 1));
      else if (['Escape', 'x', 'X', 'Backspace'].includes(e.key)) onClose();
      else if (e.key === 'Enter' && it?.href) window.open(it.href, '_blank', 'noopener');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="bag" role="dialog" aria-label="Bag — résumé">
      <div className="bag-sprite" aria-hidden><img src={`/assets/ui/bag-${frame}.png`} alt="" /></div>
      <div className="bag-tabs">
        <button type="button" className="bag-arrow" onClick={() => switchPocket(-1)} aria-label="Previous pocket">◀</button>
        <div className="bag-pocket-name">
          {p.label}
          <small>{p.section}</small>
        </div>
        <button type="button" className="bag-arrow" onClick={() => switchPocket(1)} aria-label="Next pocket">▶</button>
        <div className="bag-dots">
          {bag.map((b, i) => <span key={b.id} className={i === pocket ? 'on' : ''} />)}
        </div>
        <button type="button" className="bag-close" onClick={onClose} aria-label="Close bag">✕</button>
      </div>
      <ul className="bag-list">
        {p.items.map((x, i) => (
          <li key={x.name}>
            <button
              type="button"
              className={i === item ? 'sel' : ''}
              onMouseEnter={() => setItem(i)}
              onFocus={() => setItem(i)}
              onClick={() => { setItem(i); if (x.href && i === item) window.open(x.href, '_blank', 'noopener'); }}
            >
              <img src={itemIcon(x.icon)} alt="" />
              <span className="bag-item-name">{x.name}</span>
              {x.qty && <span className="bag-qty">{x.qty}</span>}
            </button>
          </li>
        ))}
      </ul>
      <div className="bag-detail">
        {it && (
          <>
            <img src={itemIcon(it.icon)} alt="" />
            <div>
              {it.heading && <strong>{it.heading}</strong>}
              <p>{it.description}</p>
              {it.href && <a href={it.href} target="_blank" rel="noopener">▶ USE</a>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
