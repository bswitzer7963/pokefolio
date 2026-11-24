// Enough of Pokémon Showdown's animation API (showEffect, backgroundEffect,
// sprite.anim/delay/behind) to run their move animations unmodified, using the
// Web Animations API instead of jQuery.
//
// Showdown's scene is about 640x360 with the player's Pokémon at z=0 (210,245 on
// screen) and the foe at z=200 (430,135). Those two points are mapped onto ours.

export interface ScenePos {
  x?: number; y?: number; z?: number;
  scale?: number; xscale?: number; yscale?: number;
  opacity?: number; time?: number;
}
export interface SpriteData { url: string; w: number; h: number; gen?: number; pixelated?: boolean }

// Effect images from Showdown's fx folder, with the sizes Showdown uses.
export const EFFECTS: Record<string, SpriteData> = {
  wisp: { url: '/assets/fx/wisp.png', w: 100, h: 100 },
  purplewisp: { url: '/assets/fx/purplewisp.png', w: 100, h: 100 },
  poisonwisp: { url: '/assets/fx/poisonwisp.png', w: 100, h: 100 },
  iceball: { url: '/assets/fx/iceball.png', w: 100, h: 100 },
  shadowball: { url: '/assets/fx/shadowball.png', w: 100, h: 100 },
  electroball: { url: '/assets/fx/electroball.png', w: 100, h: 100 },
  energyball: { url: '/assets/fx/energyball.png', w: 100, h: 100 },
  mistball: { url: '/assets/fx/mistball.png', w: 100, h: 100 },
  impact: { url: '/assets/fx/impact.png', w: 127, h: 119 },
  shine: { url: '/assets/fx/shine.png', w: 127, h: 119 },
  hitmark: { url: '/assets/fx/hitmarker.png', w: 100, h: 100 },
  rock1: { url: '/assets/fx/rock1.png', w: 64, h: 80 },
  rock3: { url: '/assets/fx/rock3.png', w: 66, h: 72 },
  lightning: { url: '/assets/fx/lightning.png', w: 41, h: 229 },
  fist: { url: '/assets/fx/fist.png', w: 55, h: 49 },
};

// Where the two Pokémon sit on our stage. Change these if the sprites move.
const PLAYER = { x: 82, y: 115 }; // stage centre of the player's Pokémon
const FOE = { x: 190, y: 63 }; // stage centre of the foe
const KX = (FOE.x - PLAYER.x) / 220;
const KY = (PLAYER.y - FOE.y) / 110;
// Our stage is much smaller than Showdown's, so effects are scaled down a bit.
export const FX_SIZE = 0.75;

const EASE = {
  linear: 'linear',
  swing: 'cubic-bezier(0.37, 0, 0.63, 1)', // jQuery "swing"
  quadUp: 'cubic-bezier(0.333, 0.667, 0.667, 1)', // 1-(1-x)^2
  quadDown: 'cubic-bezier(0.333, 0, 0.667, 0.333)', // x^2
  ballisticUp: 'cubic-bezier(0.333, 1.333, 0.667, 1.667)', // -3x^2+4x
  ballisticDown: 'cubic-bezier(0.333, -0.667, 0.667, -0.333)',
};
type Prop = 'left' | 'top' | 'width' | 'height' | 'opacity';

function easings(transition: string | undefined, rising: boolean): Record<Prop, string> {
  const e: Record<Prop, string> = { left: EASE.linear, top: EASE.linear, width: EASE.linear, height: EASE.linear, opacity: EASE.linear };
  switch (transition) {
    case 'ballistic': e.top = rising ? EASE.ballisticUp : EASE.ballisticDown; break;
    case 'ballisticUnder': e.top = rising ? EASE.ballisticDown : EASE.ballisticUp; break;
    case 'ballistic2': case 'ballistic2Back': e.top = rising ? EASE.quadUp : EASE.quadDown; break;
    case 'ballistic2Under': e.top = rising ? EASE.quadDown : EASE.quadUp; break;
    case 'swing': e.left = e.top = e.width = e.height = EASE.swing; break;
    case 'accel': e.left = e.top = e.width = e.height = EASE.quadDown; break;
    case 'decel': e.left = e.top = e.width = e.height = EASE.quadUp; break;
  }
  return e;
}

// Showdown's pos(), returning a centre point and size in our stage pixels.
function pos(loc: ScenePos, obj: SpriteData, sizeFactor: number) {
  const l = { x: 0, y: 0, z: 0, scale: 1, opacity: 1, ...loc };
  const xs = l.xscale ?? l.scale;
  const ys = l.yscale ?? l.scale;
  let scale = obj.gen === 5 ? 2.0 - l.z / 200 : 1.5 - 0.5 * (l.z / 200);
  if (scale < 0.1) scale = 0.1;
  const left = 210 + 220 * (l.z / 200) + l.x * scale;
  const top = 245 - 110 * (l.z / 200) - l.y * scale;
  return {
    cx: PLAYER.x + (left - 210) * KX,
    cy: PLAYER.y + (top - 245) * KY,
    w: obj.w * scale * xs * sizeFactor,
    h: obj.h * scale * ys * sizeFactor,
    scale: scale * l.scale,
    opacity: l.opacity,
  };
}
const box = (p: ReturnType<typeof pos>) => ({ left: p.cx - p.w / 2, top: p.cy - p.h / 2, width: p.w, height: p.h, opacity: p.opacity });

export class Scene {
  timeOffset = 0;
  private end = 0;
  private anims: Animation[] = [];
  private nodes: HTMLElement[] = [];
  private fxLayer: HTMLElement;
  private bgLayer: HTMLElement;
  private field: HTMLElement;
  constructor(fxLayer: HTMLElement, bgLayer: HTMLElement, field: HTMLElement) {
    this.fxLayer = fxLayer;
    this.bgLayer = bgLayer;
    this.field = field;
  }

  // Earthquake shakes the background with jQuery: scene.$bg.animate({top}, ms).animate(...)
  get $bg() {
    let t = this.timeOffset;
    let prev = 0;
    const chain = {
      animate: (css: { top?: number }, ms: number) => {
        const y = ((css.top ?? -90) + 90) * KY;
        this.run(this.field, [{ transform: `translateY(${prev}px)` }, { transform: `translateY(${y}px)` }], { delay: t, duration: ms });
        prev = y;
        t += ms;
        this.track(t);
        return chain;
      },
    };
    return chain;
  }

  private track(t: number) { this.end = Math.max(this.end, t); }
  private run(el: HTMLElement, frames: Keyframe[], opts: KeyframeAnimationOptions) {
    const a = el.animate(frames, { fill: 'forwards', ...opts });
    this.anims.push(a);
    return a;
  }

  showEffect(effect: string | SpriteData, start: ScenePos, end: ScenePos, transition: string, after?: string) {
    const fx = typeof effect === 'string' ? EFFECTS[effect] : effect;
    if (!fx) { console.warn('missing effect', effect); return; }
    const size = fx.gen === 5 ? 1 : FX_SIZE;
    start = { ...start };
    end = { ...end };
    if (!start.time) start.time = 0;
    if (!end.time) end.time = start.time + 500;
    const startTime: number = start.time + this.timeOffset;
    const endTime: number = end.time + this.timeOffset;
    start.time = startTime;
    end.time = endTime;
    if (!end.scale && end.scale !== 0 && start.scale) end.scale = start.scale;
    if (!end.xscale && end.xscale !== 0 && start.xscale) end.xscale = start.xscale;
    if (!end.yscale && end.yscale !== 0 && start.yscale) end.yscale = start.yscale;
    end = { ...start, ...end };

    const s = pos(start, fx, size);
    const e = pos(end, fx, size);
    const sb = box(s);
    const eb = box(e);
    const img = document.createElement('img');
    img.src = fx.url;
    img.alt = '';
    img.className = fx.gen === 5 ? 'fx-sprite pixel' : 'fx-sprite';
    Object.assign(img.style, {
      left: `${sb.left}px`, top: `${sb.top}px`, width: `${sb.width}px`, height: `${sb.height}px`,
      opacity: String(startTime ? 0 : sb.opacity),
    });
    this.fxLayer.appendChild(img);
    this.nodes.push(img);

    const ease = easings(transition, eb.top < sb.top);
    const delay = startTime;
    const duration = Math.max(1, endTime - startTime);
    (['left', 'top', 'width', 'height', 'opacity'] as Prop[]).forEach((p) => {
      const unit = p === 'opacity' ? '' : 'px';
      this.run(img, [{ [p]: `${sb[p]}${unit}` }, { [p]: `${eb[p]}${unit}` }], { delay, duration, easing: ease[p] });
    });
    let t = endTime;
    if (after === 'fade') {
      this.run(img, [{ opacity: eb.opacity }, { opacity: 0 }], { delay: t, duration: 100 });
      t += 100;
    } else if (after === 'explode') {
      const x = pos({ ...end, scale: (end.scale ?? 1) * 3, xscale: end.xscale && end.xscale * 3, yscale: end.yscale && end.yscale * 3, opacity: 0 }, fx, size);
      const xb = box(x);
      this.run(img, [
        { left: `${eb.left}px`, top: `${eb.top}px`, width: `${eb.width}px`, height: `${eb.height}px`, opacity: eb.opacity },
        { left: `${xb.left}px`, top: `${xb.top}px`, width: `${xb.width}px`, height: `${xb.height}px`, opacity: 0 },
      ], { delay: t, duration: 200 });
      t += 200;
    } else {
      // no-op: effects stay at their end state until cleanup(), as in Showdown
    }
    this.track(t);
  }

  backgroundEffect(bg: string, duration: number, opacity = 1, delay = 0) {
    const div = document.createElement('div');
    div.className = 'fx-bg';
    div.style.background = bg;
    div.style.opacity = '0';
    this.bgLayer.appendChild(div);
    this.nodes.push(div);
    const total = duration + 250;
    this.run(div, [
      { opacity: 0, offset: 0 },
      { opacity, offset: 250 / total },
      { opacity, offset: duration / total },
      { opacity: 0, offset: 1 },
    ], { delay: delay + this.timeOffset, duration: total });
    this.track(delay + this.timeOffset + total);
  }

  wait(ms: number) { this.track(this.timeOffset + ms); }

  duration(rigs: SpriteRig[]) { return Math.max(this.end, ...rigs.map((r) => r.endTime)); }

  cleanup(rigs: SpriteRig[]) {
    this.anims.forEach((a) => a.cancel());
    this.nodes.forEach((n) => n.remove());
    this.anims = [];
    this.nodes = [];
    rigs.forEach((r) => r.reset());
  }

  adopt(a: Animation) { this.anims.push(a); }
}

// A Pokémon on the field, with the subset of Showdown's sprite API the moves use.
export class SpriteRig {
  x = 0;
  y = 0;
  z: number;
  endTime = 0;
  private cursor = 0;
  private state: ScenePos;
  private anims: Animation[] = [];
  el: HTMLElement;
  sp: SpriteData;
  isFrontSprite: boolean;
  private scene: Scene;

  constructor(el: HTMLElement, sp: SpriteData, isFrontSprite: boolean, scene: Scene) {
    this.el = el;
    this.sp = sp;
    this.isFrontSprite = isFrontSprite;
    this.scene = scene;
    this.z = isFrontSprite ? 200 : 0;
    this.state = { x: this.x, y: this.y, z: this.z, scale: 1, opacity: 1 };
  }

  behind(offset: number) { return this.z + (this.isFrontSprite ? 1 : -1) * offset; }
  leftof(offset: number) { return this.x + (this.isFrontSprite ? 1 : -1) * offset; }
  behindx(offset: number) { return this.x + (this.isFrontSprite ? 1 : -1) * offset; }
  behindy(offset: number) { return this.y + (this.isFrontSprite ? -1 : 1) * offset; }

  delay(time: number) { this.cursor += time; this.endTime = Math.max(this.endTime, this.cursor); return this; }

  private transform(loc: ScenePos) {
    const base = pos({ x: this.x, y: this.y, z: this.z }, this.sp, 1);
    const p = pos(loc, this.sp, 1);
    const ratio = p.scale / base.scale;
    return { transform: `translate(${p.cx - base.cx}px, ${p.cy - base.cy}px) scale(${ratio})`, opacity: p.opacity };
  }

  anim(end: ScenePos, transition?: string) {
    const target: ScenePos = { x: this.x, y: this.y, z: this.z, scale: 1, opacity: 1, time: 500, ...end };
    const from = this.transform(this.state);
    const to = this.transform(target);
    const easing = transition === 'swing' ? EASE.swing : transition === 'accel' ? EASE.quadDown : transition === 'decel' ? EASE.quadUp : 'linear';
    const a = this.el.animate([from, to], { delay: this.cursor + this.scene.timeOffset, duration: Math.max(1, target.time!), easing, fill: 'forwards' });
    this.anims.push(a);
    this.scene.adopt(a);
    this.cursor += target.time!;
    this.endTime = Math.max(this.endTime, this.cursor + this.scene.timeOffset);
    this.state = target;
    return this;
  }

  reset() {
    this.anims.forEach((a) => a.cancel());
    this.anims = [];
    this.cursor = 0;
    this.endTime = 0;
    this.state = { x: this.x, y: this.y, z: this.z, scale: 1, opacity: 1 };
  }
}
