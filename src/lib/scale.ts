export const STAGE_W = 256;
export const STAGE_H = 192;

// Width kept free on each side for the control rail.
export const RAIL_W = 64;

// How much to scale the 256x192 screen. It fills the window's height when there's
// room for the side rails, otherwise it fits the width (phones in portrait).
// The result is snapped to whole device pixels so the art stays sharp.
export function stageLayout(w = window.innerWidth, h = window.innerHeight) {
  const dpr = window.devicePixelRatio || 1;
  const byHeight = h / STAGE_H;
  const rails = w - STAGE_W * byHeight >= RAIL_W * 2;
  const raw = rails ? byHeight : Math.min(w / STAGE_W, (h - 44) / STAGE_H);
  return { scale: Math.floor(raw * STAGE_W * dpr) / (STAGE_W * dpr), rails };
}
