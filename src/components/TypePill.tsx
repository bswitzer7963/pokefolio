import type { PokeType } from '../data/portfolio';

// Gen 5 type badge (32x12 sprite). `scale` enlarges it for the non-game pages.
export function TypePill({ type, scale = 1 }: { type: PokeType; scale?: number }) {
  return (
    <img
      className="type-pill"
      src={`/assets/ui/types/${type}.png`}
      alt={type}
      width={32 * scale}
      height={12 * scale}
    />
  );
}
