import { Scene, SpriteRig, type SpriteData } from './fx/engine';
import { SHOWDOWN_ANIMS } from './fx/showdownMoves';

// Attack animations, chosen per project in portfolio.ts.
// To add a move: copy its `anim` from Showdown's battle-animations-moves.ts into fx/showdownMoves.ts,
// put any effect images it uses in public/assets/fx (and register them in fx/engine.ts), then list it here.
export const ANIMATIONS = {
  boomburst: { label: 'Boomburst — expanding sound waves, foe recoils', showdown: 'boomburst' },
  futureSight: { label: 'Future Sight — screen dims, psychic flashes, foe pulses', showdown: 'futuresight' },
  rollout: { label: 'Rollout — your Pokémon dashes into the foe', showdown: 'rollout' },
  sludge: { label: 'Sludge — three arcing poison blobs', showdown: 'sludge' },
  earthquake: { label: 'Earthquake — ground shakes, rocks fly', showdown: 'earthquake' },
  hyperBeam: { label: 'Hyper Beam — charged orb stream', showdown: 'hyperbeam' },
  thunderbolt: { label: 'Thunderbolt — lightning strikes', showdown: 'thunderbolt' },
} satisfies Record<string, { label: string; showdown: keyof typeof SHOWDOWN_ANIMS }>;

export type AnimationId = keyof typeof ANIMATIONS;

export interface StageRefs {
  fxLayer: HTMLElement;
  bgLayer: HTMLElement;
  field: HTMLElement;
  playerRig: HTMLElement;
  foeRig: HTMLElement;
}

function spriteData(rig: HTMLElement): SpriteData {
  const img = rig.querySelector('img');
  return { url: img?.src ?? '', w: img?.naturalWidth || 80, h: img?.naturalHeight || 80, gen: 5 };
}

export function playMove(id: AnimationId, refs: StageRefs): Promise<void> {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return new Promise((r) => setTimeout(r, 300));
  }
  const scene = new Scene(refs.fxLayer, refs.bgLayer, refs.field);
  const attacker = new SpriteRig(refs.playerRig, spriteData(refs.playerRig), false, scene);
  const defender = new SpriteRig(refs.foeRig, spriteData(refs.foeRig), true, scene);
  SHOWDOWN_ANIMS[ANIMATIONS[id].showdown].anim(scene, [attacker, defender]);
  const ms = scene.duration([attacker, defender]) + 150;
  return new Promise((resolve) => {
    setTimeout(() => {
      scene.cleanup([attacker, defender]);
      resolve();
    }, ms);
  });
}
