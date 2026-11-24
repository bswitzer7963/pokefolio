import { useSyncExternalStore } from 'react';
import { assets, type MusicId, type SfxId, type Track } from '../data/assets';

// Web Audio rather than <audio>: music can loop at the game's loop points and
// sound effects play without delay. Browsers keep audio locked until the first click or key press.

const KEY = 'pokefolio-muted';
let muted = (() => {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
})();
const listeners = new Set<() => void>();

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();

let music: { id: MusicId; src: AudioBufferSourceNode | null; gain: GainNode; token: number } | null = null;
let token = 0;
let unlockedAt = 0; // when the browser first let us play audio
let wanted: { id: MusicId; loop: boolean } | null = null;

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);
  return ctx;
}

function load(src: string) {
  if (!src) return Promise.resolve(null);
  let p = buffers.get(src);
  if (!p) {
    const c = ensureCtx();
    p = c
      ? fetch(src)
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
          .then((b) => c.decodeAudioData(b))
          .catch(() => null)
      : Promise.resolve(null);
    buffers.set(src, p);
  }
  return p;
}

async function start(id: MusicId, loop: boolean) {
  const c = ensureCtx();
  if (!c || !master) return;
  const track: Track = assets.music[id];
  const my = ++token;
  const gain = c.createGain();
  gain.gain.value = track.volume ?? 0.55;
  gain.connect(master);
  music = { id, src: null, gain, token: my };
  const buf = await load(track.src);
  if (!buf || my !== token) { gain.disconnect(); return; }
  const src = c.createBufferSource();
  src.buffer = buf;
  if (loop && track.loopEnd) {
    src.loop = true;
    src.loopStart = track.loopStart ?? 0;
    src.loopEnd = track.loopEnd;
  }
  src.connect(gain);
  src.start();
  music.src = src;
}

function fadeOut(m: NonNullable<typeof music>, ms: number) {
  if (!ctx) return;
  const t = ctx.currentTime;
  m.gain.gain.cancelScheduledValues(t);
  m.gain.gain.setValueAtTime(m.gain.gain.value, t);
  m.gain.gain.linearRampToValueAtTime(0, t + ms / 1000);
  const src = m.src;
  window.setTimeout(() => { try { src?.stop(); } catch { /* already stopped */ } m.gain.disconnect(); }, ms + 50);
}

export const audio = {
  // also starts music that was requested while audio was still locked
  unlock() {
    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (!unlockedAt) {
      unlockedAt = performance.now();
      listeners.forEach((l) => l());
    }
    Object.values(assets.sfx).forEach((s) => load(s));
    if (wanted && music?.id !== wanted.id) start(wanted.id, wanted.loop);
  },
  playMusic(id: MusicId, { loop = true } = {}) {
    wanted = { id, loop };
    if (music?.id === id) return;
    if (music) fadeOut(music, 200);
    music = null;
    if (!assets.music[id].src) return;
    if (ctx && ctx.state !== 'suspended') start(id, loop);
    else if (ctx) ctx.resume().then(() => { if (wanted?.id === id && !music) start(id, loop); });
  },
  stopMusic(fadeMs = 250) {
    wanted = null;
    token++;
    if (music) fadeOut(music, fadeMs);
    music = null;
  },
  sfx(id: SfxId) {
    const c = ensureCtx();
    if (!c || !master || muted) return;
    load(assets.sfx[id]).then((buf) => {
      if (!buf || !master) return;
      const s = c.createBufferSource();
      s.buffer = buf;
      const g = c.createGain();
      g.gain.value = 0.8;
      s.connect(g).connect(master);
      s.start();
    });
  },
  isMuted: () => muted,
  isUnlocked: () => unlockedAt > 0,
  // For the sound button. The click that first unlocks audio always turns sound on,
  // instead of toggling it straight back off.
  toggleSound() {
    const justUnlocked = performance.now() - unlockedAt < 1000;
    this.unlock();
    this.setMuted(justUnlocked ? false : !muted);
  },
  setMuted(m: boolean) {
    muted = m;
    try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* storage unavailable */ }
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.02);
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
};

if (typeof window !== 'undefined') {
  const u = () => audio.unlock();
  window.addEventListener('pointerdown', u);
  window.addEventListener('keydown', u);
}

export function useMuted() {
  return useSyncExternalStore(audio.subscribe, audio.isMuted, audio.isMuted);
}

// Sound counts as off until the browser has let us start audio.
export function useSoundOn() {
  const read = () => audio.isUnlocked() && !audio.isMuted();
  return useSyncExternalStore(audio.subscribe, read, read);
}
