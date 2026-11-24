# Pokéfolio

My portfolio, built as a Pokémon Black 2 battle. Each project is a move: use it on me
and you land on that project's page. The Bag holds my CV, catching me opens my contact
info, and there's a plain version of the site for anyone who'd rather skip the game.

Built with React, TypeScript and Vite. No UI or animation libraries; the battle
animations run on the Web Animations API.

## Layout

- `src/data/portfolio.ts`: all the content (projects, CV, contact info, what each game term means)
- `src/data/assets.ts`: every sprite, sound and image the game uses
- `src/battle/`: the battle screen, Bag and Pokédex
- `src/battle/fx/`: attack animations (see below)
- `src/screens/`: title screen, project pages, static portfolio
- `scripts/mkfont.py`: rebuilds the pixel font from a font sheet

Routes: `/` title screen, `/battle`, `/project/:id`, `/portfolio` (no game),
and `/animations`, an unlinked page for previewing attack animations.

## Attack animations

The move animations come from [Pokémon Showdown's client](https://github.com/smogon/pokemon-showdown-client).
`src/battle/fx/engine.ts` implements the parts of Showdown's animation API those moves use, so
`src/battle/fx/showdownMoves.ts` can hold their code unchanged.

## Credits and licence

Copyright (C) 2026 Braden Switzer. Licensed under the GNU AGPL-3.0 (see `LICENSE`).

- Move animations and effect images: Pokémon Showdown. Its client is AGPL-3.0, so this
  repository is AGPL-3.0 as well (see `LICENSE`).
- Sprites, music, sound effects and UI art are from Pokémon Black 2 / White 2
  (© Nintendo / Game Freak / The Pokémon Company) and are not covered by the licence.
  Sprites come from the PokeAPI sprite repo; UI rips from The Spriters Resource
  (GameMaster12, Ikard, Ploaj).

### Please enjoy!

- While this will act as my serious portfolio site, and a more "serious" iteration can be accessed in the main menu, this piece is really intended to show a little bit of who I am in a lighthearted manner while you browse my CV. 