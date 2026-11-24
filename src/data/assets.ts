// Every game asset is referenced from here, so swapping one out is a one-line change.
// A missing file just means silence or a CSS fallback.

// Loop points are in seconds, taken from the BCSTM files. No loopEnd means play once.
export interface Track { src: string; loopStart?: number; loopEnd?: number; volume?: number }

export const assets = {
  ui: {
    // picked by the visitor's local time of day
    battleBg: {
      day: '/assets/ui/bg-grass-day.png',
      evening: '/assets/ui/bg-grass-evening.png',
      night: '/assets/ui/bg-grass-night.png',
    },
    hpPlayer: '/assets/ui/hp-player.png',
    hpFoe: '/assets/ui/hp-foe.png',
    lv: '/assets/ui/lv.png',
    savePanel: '/assets/ui/save-panel.png',
    pokeBall: '/assets/items/poke-ball.png',
  },
  music: {
    title: { src: '/assets/audio/title.mp3', loopStart: 0, loopEnd: 43.011678 },
    battle: { src: '/assets/audio/battle-trainer.mp3', loopStart: 13.978413, loopEnd: 109.46068 },
    // alternative battle theme
    battleRival: { src: '/assets/audio/battle-rival.mp3', loopStart: 7.151746, loopEnd: 68.707846 },
    // soundtrack version with a proper ending, so it isn't looped
    victory: { src: '/assets/audio/victory.mp3', volume: 0.5 },
    caught: { src: '/assets/audio/caught.mp3' },
  } satisfies Record<string, Track>,
  sfx: {
    select: '/assets/audio/sfx-select.mp3', // SEQ_SE_DECIDE1
    cursor: '/assets/audio/sfx-cursor.mp3', // SEQ_SE_SELECT1
    hit: '/assets/audio/sfx-hit.mp3', // SEQ_SE_KOUKA_H (super effective)
    faint: '/assets/audio/sfx-faint.mp3', // SEQ_SE_HINSHI
    exp: '/assets/audio/sfx-exp.mp3', // SEQ_SE_EXP
    ballThrow: '/assets/audio/sfx-ball-throw.mp3', // SEQ_SE_NAGERU
    ballOpen: '/assets/audio/sfx-ball-open.mp3', // SEQ_SE_BOWA1
    ballShake: '/assets/audio/sfx-ball-shake.mp3', // SEQ_SE_KON
    ballClick: '/assets/audio/sfx-ball-click.mp3', // SEQ_SE_GETTING
    flee: '/assets/audio/sfx-flee.mp3', // SEQ_SE_NIGERU
    cry: '/assets/audio/cry-quagsire.mp3',
  },
};

export type MusicId = keyof typeof assets.music;
export type SfxId = keyof typeof assets.sfx;

export const itemIcon = (name: string) => `/assets/items/${name}.png`;

export function battleBackground(date = new Date()) {
  const h = date.getHours();
  const { day, evening, night } = assets.ui.battleBg;
  return h >= 7 && h < 17 ? day : h >= 17 && h < 20 ? evening : night;
}
