import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Stage } from '../components/Stage';
import { TextBox, type Message } from '../components/TextBox';
import { TypePill } from '../components/TypePill';
import { useTransitionNav } from '../components/transitions';
import { braden, projects, site, statMeaning, typeMeaning } from '../data/portfolio';
import { Hint } from '../components/Hint';
import { assets, battleBackground } from '../data/assets';
import { audio } from '../lib/audio';
import { usePartner } from '../lib/partner';
import { playMove } from './animations';
import { HpBox } from './HpBox';
import { Bag } from './Bag';
import { Dex } from './Dex';

type Phase = 'intro' | 'menu' | 'fight' | 'bag' | 'busy' | 'dex';
type FoeState = 'hidden' | 'idle' | 'hit' | 'faint' | 'absorb' | 'gone';
type BallState = null | 'throw' | 'drop' | 'shake' | 'caught';

const COMMANDS = [
  { id: 'fight', label: 'FIGHT', key: 'F' },
  { id: 'bag', label: 'BAG', key: 'B' },
  { id: 'catch', label: 'CATCH', key: 'C' },
  { id: 'run', label: 'RUN', key: 'R' },
] as const;

const PER_PAGE = 4;

export default function Battle() {
  const go = useTransitionNav();
  const partner = usePartner();

  const [phase, setPhase] = useState<Phase>('intro');
  const [msg, setMsg] = useState<Message | null>(null);
  const [foe, setFoe] = useState<FoeState>('hidden');
  const [playerIn, setPlayerIn] = useState(false);
  const [boxes, setBoxes] = useState(false);
  const [foeHp, setFoeHp] = useState(100);
  const [ball, setBall] = useState<BallState>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [caught, setCaught] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [moveSel, setMoveSel] = useState(0);
  const [movePage, setMovePage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [readingKey, setReadingKey] = useState<string | null>(null); // which move's description is expanded
  const [overflow, setOverflow] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
  const [exp, setExp] = useState(35);
  const [bg] = useState(() => battleBackground());

  const alive = useRef(true);
  const started = useRef(false);
  const resolver = useRef<(() => void) | null>(null);
  const msgId = useRef(0);
  const pointerType = useRef('mouse');
  const fxRef = useRef<HTMLDivElement>(null);
  const bgFxRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const playerRigRef = useRef<HTMLSpanElement>(null);
  const foeRigRef = useRef<HTMLSpanElement>(null);
  const [touchUI, setTouchUI] = useState(false);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  // Promise helpers for scripting the battle. They never resolve after unmount, so a
  // half-finished sequence just stops.
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(() => alive.current && r(), ms));
  const say = (text: string, mode: Message['mode'] = 'click') =>
    new Promise<void>((r) => {
      msgId.current += 1;
      setMsg({ id: msgId.current, text, mode });
      resolver.current = () => alive.current && r();
    });
  const show = (text: string) => { msgId.current += 1; setMsg({ id: msgId.current, text, mode: 'hold' }); };
  const advance = useCallback(() => { const r = resolver.current; resolver.current = null; r?.(); }, []);

  const toMenu = () => { setMsg(null); setShowInfo(false); setPhase('menu'); };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      audio.playMusic('battle');
      await sleep(250);
      setFoe('idle');
      await sleep(650);
      audio.sfx('cry');
      await say(`A wild ${braden.name} appeared!`, 1300);
      setPlayerIn(true);
      await say(`Go! ${partner.name}!`, 900);
      setBoxes(true);
      await sleep(350);
      toMenu();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attack = async (i: number) => {
    const p = projects[i];
    if (!p || phase !== 'fight') return;
    setPhase('busy');
    setShowInfo(false);
    audio.sfx('select');
    await say(`${partner.name} used ${p.move.name}!`, 650);
    if (fxRef.current && bgFxRef.current && fieldRef.current && playerRigRef.current && foeRigRef.current) {
      await playMove(p.animation, {
        fxLayer: fxRef.current, bgLayer: bgFxRef.current, field: fieldRef.current,
        playerRig: playerRigRef.current, foeRig: foeRigRef.current,
      });
      if (!alive.current) return;
    }
    audio.sfx('hit');
    setFoe('hit');
    setFoeHp(0);
    await sleep(1500);
    await say("It's super effective!", 900);
    audio.sfx('cry');
    setFoe('faint');
    audio.sfx('faint');
    await sleep(600);
    await say(`The wild ${braden.name} fainted!`);
    if (assets.music.victory.src) audio.playMusic('victory');
    else audio.stopMusic(1200);
    setExp(100);
    audio.sfx('exp');
    await say(`${partner.name} gained ${(p.move.power * 13).toLocaleString()} EXP. Points!`, 1600);
    go(`/project/${p.id}`, p.transition);
  };

  const doCatch = async () => {
    setPhase('busy');
    audio.sfx('ballThrow');
    show('You threw a POKé BALL!');
    setBall('throw');
    await sleep(800);
    audio.sfx('ballOpen');
    setFoe('absorb');
    await sleep(550);
    setBall('drop');
    await sleep(600);
    setBall('shake');
    for (let n = 0; n < 3; n++) {
      setShakeKey((k) => k + 1);
      audio.sfx('ballShake');
      await sleep(900);
    }
    audio.sfx('ballClick');
    setBall('caught');
    setCaught(true);
    audio.stopMusic(150);
    await sleep(500);
    audio.playMusic('caught', { loop: false });
    // like the game: the victory theme follows the catch jingle
    window.setTimeout(() => { if (alive.current) audio.playMusic('victory', { loop: false }); }, 3800);
    await say(site.catchLine);
    await say(`${braden.name}'s data was added to the POKéDEX.`);
    setMsg(null);
    setPhase('dex');
  };

  const doRun = async () => {
    setPhase('busy');
    audio.sfx('flee');
    await say('Got away safely!', 900);
    audio.stopMusic();
    go('/', 'fadeBlack');
  };

  const command = (id: (typeof COMMANDS)[number]['id']) => {
    if (phase !== 'menu') return;
    audio.sfx('select');
    if (id === 'fight') { setPhase('fight'); setShowInfo(true); }
    else if (id === 'bag') setPhase('bag');
    else if (id === 'catch') doCatch();
    else doRun();
  };

  const pages = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const pageMoves = projects.slice(movePage * PER_PAGE, movePage * PER_PAGE + PER_PAGE);

  const selected = pageMoves[moveSel];
  const moveKey = `${movePage}-${moveSel}`;
  const reading = phase === 'fight' && readingKey === moveKey;
  const setReading = (on: boolean) => setReadingKey(on ? moveKey : null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (phase === 'menu') {
        const hot = COMMANDS.find((c) => c.key === k.toUpperCase());
        if (hot) command(hot.id);
        else if (k === 'ArrowLeft') { audio.sfx('cursor'); setCursor((c) => (c + COMMANDS.length - 1) % COMMANDS.length); }
        else if (k === 'ArrowRight') { audio.sfx('cursor'); setCursor((c) => (c + 1) % COMMANDS.length); }
        else if (['Enter', 'z', 'Z', ' '].includes(k)) command(COMMANDS[cursor].id);
        else return;
        e.preventDefault();
      } else if (phase === 'fight' && reading) {
        if (k === 'ArrowUp' || k === 'ArrowDown') descRef.current?.scrollBy({ top: k === 'ArrowUp' ? -30 : 30 });
        else if (['Enter', 'z', 'Z'].includes(k)) attack(movePage * PER_PAGE + moveSel);
        else if ([' ', 'Escape', 'x', 'X', 'Backspace'].includes(k)) setReading(false);
        else return;
        e.preventDefault();
      } else if (phase === 'fight') {
        const n = pageMoves.length;
        if (/^[1-9]$/.test(k) && Number(k) <= n) { setMoveSel(Number(k) - 1); setShowInfo(true); }
        else if (k === 'ArrowLeft' || k === 'ArrowRight') { setMoveSel((m) => Math.min(n - 1, m ^ 1)); setShowInfo(true); }
        else if (k === 'ArrowUp' || k === 'ArrowDown') { setMoveSel((m) => Math.min(n - 1, m ^ 2)); setShowInfo(true); }
        else if (['Enter', 'z', 'Z'].includes(k)) attack(movePage * PER_PAGE + moveSel);
        else if (k === ' ' && showInfo) setReading(true);
        else if (['Escape', 'x', 'X', 'Backspace'].includes(k)) toMenu();
        else if ((k === 'PageDown' || k === ']') && pages > 1) { setMovePage((p) => (p + 1) % pages); setMoveSel(0); }
        else if ((k === 'PageUp' || k === '[') && pages > 1) { setMovePage((p) => (p - 1 + pages) % pages); setMoveSel(0); }
        else return;
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });


  // Show "More" only when the description doesn't fit in the small panel.
  useLayoutEffect(() => {
    const el = descRef.current;
    if (!el || reading) return;
    el.scrollTop = 0;
    setOverflow(el.scrollHeight > el.clientHeight + 1);
  }, [selected, showInfo, reading]);

  return (
    <Stage className="battle">
      <div className="scene">
      {/* Field */}
      <div ref={fieldRef} className={`field ${bg ? '' : 'field-placeholder'}`} style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
        {!bg && <><div className="platform platform-foe" /><div className="platform platform-player" /></>}
      </div>

      {/* Foe (Braden) */}
      <div className={`foe foe-${foe}`}>
        <span ref={foeRigRef} className="rig"><img src={braden.sprite} alt={`${braden.name} (shiny Quagsire)`} /></span>
      </div>

      {/* Player */}
      <div ref={bgFxRef} className="fx-bglayer" aria-hidden />
      <div className={`player ${playerIn ? 'in' : ''}`}>
        <span ref={playerRigRef} className="rig"><img key={partner.id} src={partner.sprite} alt={`Your ${partner.name}`} /></span>
      </div>

      {/* Poké Ball */}
      {ball && (
        <div className={`ball ball-${ball}`}>
          <div className="ball-y">
            <img key={ball === 'shake' ? shakeKey : ball} className={ball === 'shake' ? 'wiggle' : ''} src={assets.ui.pokeBall} alt="" />
            {ball === 'caught' && [0, 1, 2, 3].map((i) => <span key={i} className="ball-star" style={{ ['--i' as string]: i }} />)}
          </div>
        </div>
      )}

      {/* Attack effects */}
      <div ref={fxRef} className="fx-layer" aria-hidden />

      <HpBox side="foe" name={braden.name} level={braden.level} gender={braden.gender} shiny={braden.shiny} hp={foeHp} visible={boxes && foe !== 'gone'} caught={caught} levelHint={braden.levelMeaning} shinyHint={braden.shinyMeaning} />
      <HpBox side="player" name={partner.name} level={partner.level} hp={100} maxHp={partner.level * 3 + 10} exp={exp} visible={boxes} />

      {/* Move info (hover / focus) */}
      {phase === 'fight' && showInfo && selected && (
        <div
          className={`move-info ${reading ? 'reading' : ''}`}
          role="region"
          aria-label={`${selected.move.name}: ${selected.title}`}
          onClick={() => { if (!reading && overflow) setReading(true); }}
        >
          <div className="move-info-head">
            <span className="move-info-name">{selected.move.name}</span>
            <Hint text={typeMeaning[selected.move.type] ?? `${selected.move.type} type`}><TypePill type={selected.move.type} /></Hint>
          </div>
          <div className="move-info-stats">
            <Hint text={statMeaning.category}>{selected.move.category.toUpperCase()}</Hint>
            <Hint text={statMeaning.power}>POW {selected.move.power}</Hint>
            <Hint text={statMeaning.accuracy}>ACC {selected.move.accuracy}</Hint>
            <Hint text={statMeaning.pp}>PP {selected.move.pp}/{selected.move.pp}</Hint>
          </div>
          <div className="move-info-project">{selected.title}</div>
          <div ref={descRef} className="move-info-desc">
            {reading && <p className="move-info-tagline">{selected.tagline}</p>}
            <p>{selected.description}</p>
          </div>
          {reading ? (
            <div className="move-info-foot">
              <button type="button" onClick={(e) => { e.stopPropagation(); setReading(false); }}>◀ BACK</button>
              <span className="move-info-keys">↑↓ scroll</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); attack(movePage * PER_PAGE + moveSel); }}>USE ▶</button>
            </div>
          ) : (
            <div className="move-info-hint">
              {overflow && <span className="move-info-more">▼ More ({touchUI ? 'tap here' : 'Space'})</span>}
              <span>{touchUI ? 'Tap the move again to use' : 'Enter to use'} ▶</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom panel */}
      <div className="panel">
        {(phase === 'intro' || phase === 'busy') && <TextBox key={msg?.id} message={msg} onAdvance={advance} />}

        {phase === 'menu' && (
          <div className="command">
            <div className="command-prompt">
              What will {partner.name} do?
              <span className="key-hint">{COMMANDS.map((c) => c.key).join(' ')}</span>
            </div>
            <div className="hud-buttons" role="menu">
              {COMMANDS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="menuitem"
                  aria-label={`${c.label} (${c.key})`}
                  className={`hud-btn hud-${c.id} ${cursor === i ? 'sel' : ''}`}
                  onMouseEnter={() => setCursor(i)}
                  onFocus={() => setCursor(i)}
                  onClick={() => command(c.id)}
                >
                  <img src={`/assets/ui/hud/label-${c.id}.png`} alt="" />
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'fight' && (
          <div className="moves">
            <div className="moves-grid" role="menu">
              {pageMoves.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="menuitem"
                  className={`move ${moveSel === i ? 'sel' : ''}`}
                  style={{ backgroundImage: `url(/assets/ui/moves/${p.move.type}${moveSel === i ? '-sel' : ''}.png)` }}
                  aria-label={`${p.move.name} (${i + 1})`}
                  onPointerDown={(e) => { pointerType.current = e.pointerType; setTouchUI(e.pointerType !== 'mouse'); }}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setMoveSel(i); setShowInfo(true); } }}
                  onFocus={() => { setMoveSel(i); setShowInfo(true); }}
                  onClick={() => {
                    if (pointerType.current !== 'mouse' && (moveSel !== i || !showInfo)) { setMoveSel(i); setShowInfo(true); return; }
                    attack(movePage * PER_PAGE + i);
                  }}
                >
                  {p.move.name}
                </button>
              ))}
            </div>
            <div className="moves-side">
              {pages > 1 && (
                <button type="button" className="moves-page" onClick={() => { setMovePage((p) => (p + 1) % pages); setMoveSel(0); }}>
                  {movePage + 1}/{pages} ▶
                </button>
              )}
              <button type="button" className="moves-back" onClick={toMenu} aria-label="Back (X)">BACK</button>
            </div>
          </div>
        )}

        {(phase === 'bag' || phase === 'dex') && <div className="panel-blank" />}
      </div>

      {phase === 'bag' && <Bag onClose={toMenu} />}
      {phase === 'dex' && (
        <Dex
          onBattleAgain={() => go(`/battle?r=${Date.now()}`, 'encounter')}
          onTitle={() => { audio.stopMusic(); go('/', 'fadeBlack'); }}
          onStatic={() => { audio.stopMusic(); go('/portfolio', 'fadeWhite'); }}
        />
      )}
      </div>
    </Stage>
  );
}
