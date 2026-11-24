/**
 * Move animations ported from Pokémon Showdown's client
 * (https://github.com/smogon/pokemon-showdown-client — play.pokemonshowdown.com/src/battle-animations-moves.ts
 * and battle-animations.ts). The move bodies below are copied unchanged; they run on ./engine.ts.
 *
 * Pokémon Showdown's client is licensed under the GNU AGPLv3. This file is a derivative of it and is
 * therefore AGPLv3 too. Effect images in /public/assets/fx come from Showdown and their credited artists.
 */
/* eslint-disable */
// @ts-nocheck: verbatim upstream code (unused params etc.)
import type { Scene, SpriteRig } from './engine';

type AnimData = { anim(scene: Scene, args: SpriteRig[]): void };

const showdown: Record<string, AnimData> = {
    boomburst: {
    anim(scene, [attacker, ...defenders]) {
      for (const defender of defenders) {
        defender.delay(125);
        defender.anim({
          z: defender.behind(5),
          time: 75,
        }, 'swing');
        defender.anim({
          time: 75,
        }, 'swing');
        defender.anim({
          z: defender.behind(5),
          time: 75,
        }, 'swing');
        defender.anim({
          time: 75,
        }, 'swing');
        defender.anim({
          z: defender.behind(5),
          time: 75,
        }, 'swing');
        defender.anim({
          time: 75,
        }, 'swing');
        defender.anim({
          z: defender.behind(5),
          time: 75,
        }, 'swing');
        defender.anim({
          time: 150,
        }, 'swing');
      }

      scene.backgroundEffect('#000000', 900, 0.5);
      scene.showEffect('iceball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 0,
      }, {
        z: attacker.behind(-50),
        scale: 7,
        opacity: 0,
        time: 400,
      }, 'linear');
      scene.showEffect('iceball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 150,
      }, {
        z: attacker.behind(-50),
        scale: 7,
        opacity: 0,
        time: 600,
      }, 'linear');
      scene.showEffect('iceball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 300,
      }, {
        z: attacker.behind(-50),
        scale: 7,
        opacity: 0,
        time: 800,
      }, 'linear');
    },
  },
  sludge: {
    anim(scene, [attacker, defender]) {
      scene.showEffect('purplewisp', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400,
      }, 'ballistic', 'fade');
      scene.showEffect('purplewisp', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100,
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500,
      }, 'ballistic', 'fade');
      scene.showEffect('purplewisp', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200,
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600,
      }, 'ballistic', 'fade');
    },
  },
  earthquake: {
    anim(scene, [attacker, ...defenders]) {
      scene.$bg.animate({
        top: -90,
        bottom: 0,
      }, 75).animate({
        top: -100,
        bottom: -10,
      }, 100).animate({
        top: -90,
        bottom: 0,
      }, 100).animate({
        top: -95,
        bottom: -5,
      }, 100).animate({
        top: -90,
        bottom: 0,
      }, 100).animate({
        top: -95,
        bottom: -5,
      }, 100).animate({
        top: -90,
        bottom: 0,
      }, 100).animate({
        top: -92,
        bottom: -2,
      }, 100).animate({
        top: -90,
        bottom: 0,
      }, 100).animate({
        top: -92,
        bottom: -2,
      }, 100).animate({
        top: -90,
        bottom: 0,
      }, 100);

      attacker.anim({
        y: attacker.y - 10,
        yscale: 1,
        time: 75,
      });
      attacker.anim({
        y: attacker.y + 10,
        yscale: 0.9,
        time: 100,
      });
      attacker.anim({
        y: attacker.y - 7,
        yscale: 1,
        time: 100,
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100,
      });
      attacker.anim({
        y: attacker.y - 7,
        time: 100,
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100,
      });
      attacker.anim({
        y: attacker.y - 7,
        time: 100,
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100,
      });
      attacker.anim({
        y: attacker.y - 2,
        time: 100,
      });
      attacker.anim({
        y: attacker.y + 2,
        time: 100,
      });
      attacker.anim({
        y: attacker.y,
        time: 100,
      });

      for (const defender of defenders) {
        defender.anim({
          y: defender.y - 10,
          time: 75,
        });
        defender.anim({
          y: defender.y + 10,
          time: 100,
        });
        defender.anim({
          y: defender.y - 7,
          time: 100,
        });
        defender.anim({
          y: defender.y + 7,
          time: 100,
        });
        defender.anim({
          y: defender.y - 7,
          time: 100,
        });
        defender.anim({
          y: defender.y + 7,
          time: 100,
        });
        defender.anim({
          y: defender.y - 7,
          time: 100,
        });
        defender.anim({
          y: defender.y + 7,
          time: 100,
        });
        defender.anim({
          y: defender.y - 2,
          time: 100,
        });
        defender.anim({
          y: defender.y + 2,
          time: 100,
        });
        defender.anim({
          y: defender.y,
          time: 100,
        });

        scene.showEffect('rock3', {
          x: defender.x + 5,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 0,
        }, {
          x: defender.x + 30,
          y: defender.y,
          scale: 0.4,
          opacity: 0,
          time: 350,
        }, 'ballistic');
        scene.showEffect('rock3', {
          x: defender.x - 10,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 250,
        }, {
          x: defender.x - 35,
          y: defender.y,
          scale: 0.3,
          opacity: 0,
          time: 600,
        }, 'ballistic');
        scene.showEffect('rock3', {
          x: defender.x + 40,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 400,
        }, {
          x: defender.x + 65,
          y: defender.y,
          scale: 0.3,
          opacity: 0,
          time: 750,
        }, 'ballistic2');
        scene.showEffect('rock3', {
          x: defender.x,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.3,
          opacity: 1,
          time: 500,
        }, {
          x: defender.x + 40,
          y: defender.y,
          scale: 0.4,
          opacity: 0,
          time: 750,
        }, 'ballistic');
      }
    },
  },
  thunderbolt: {
    anim(scene, [attacker, defender]) {
      scene.backgroundEffect('#000000', 600, 0.2);
      scene.showEffect('lightning', {
        x: defender.x,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2,
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 200,
      }, 'linear', 'fade');
      scene.showEffect('lightning', {
        x: defender.x - 15,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2,
        time: 200,
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 400,
      }, 'linear', 'fade');
      scene.showEffect('lightning', {
        x: defender.x + 15,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2,
        time: 400,
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 600,
      }, 'linear', 'fade');
    },
  },
  hyperbeam: {
    anim(scene, [attacker, defender]) {
      scene.backgroundEffect('#000000', 700, 0.2);
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 200,
      }, 'linear', 'explode');
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 75,
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 275,
      }, 'linear', 'explode');
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 150,
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 350,
      }, 'linear', 'explode');
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 225,
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 425,
      }, 'linear', 'explode');
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 300,
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 500,
      }, 'linear', 'explode');
      scene.showEffect('electroball', {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 375,
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 575,
      }, 'linear', 'explode');

      scene.showEffect('shadowball', {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 550,
      }, {
        scale: 4,
        opacity: 0,
        time: 750,
      }, 'linear');
      scene.showEffect('shadowball', {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600,
      }, {
        scale: 4,
        opacity: 0,
        time: 800,
      }, 'linear');

      defender.delay(125);
      defender.anim({
        z: defender.behind(5),
        time: 75,
      }, 'swing');
      defender.anim({
        time: 75,
      }, 'swing');
      defender.anim({
        z: defender.behind(5),
        time: 75,
      }, 'swing');
      defender.anim({
        time: 75,
      }, 'swing');
      defender.anim({
        z: defender.behind(5),
        time: 75,
      }, 'swing');
      defender.anim({
        time: 75,
      }, 'swing');
      defender.anim({
        z: defender.behind(5),
        time: 75,
      }, 'swing');
      defender.anim({
        time: 150,
      }, 'swing');
    },
  },
  doomdesire: {
    anim(scene) {
      scene.backgroundEffect('#000000', 300, 0.2);
      scene.backgroundEffect('#000000', 300, 0.3, 200);
    },
  },
  fastattack: {
    anim(scene, [attacker, defender]) {
      scene.showEffect('wisp', {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 260,
      }, {
        scale: 2,
        opacity: 0,
        time: 560,
      }, 'linear');
      scene.showEffect('wisp', {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 310,
      }, {
        scale: 2,
        opacity: 0,
        time: 610,
      }, 'linear');
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50,
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 350,
      }, 'accel', 'fade');
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100,
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 400,
      }, 'accel', 'fade');
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 300,
        opacity: 0.5,
      }, 'accel');
      attacker.anim({
        x: defender.x,
        y: defender.x,
        z: defender.behind(100),
        opacity: 0,
        time: 100,
      }, 'linear');
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(70),
        opacity: 0,
        time: 1,
      }, 'linear');
      attacker.anim({
        opacity: 1,
        time: 500,
      }, 'decel');
      defender.delay(260);
      defender.anim({
        z: defender.behind(30),
        time: 100,
      }, 'swing');
      defender.anim({
        time: 300,
      }, 'swing');
    },
  },
  futuresighthit: {
    anim(scene, [defender]) {
      scene.backgroundEffect('#AA44BB', 250, 0.6);
      scene.backgroundEffect('#AA44FF', 250, 0.6, 400);
      defender.anim({
        scale: 1.2,
        time: 100,
      });
      defender.anim({
        scale: 1,
        time: 100,
      });
      defender.anim({
        scale: 1.4,
        time: 150,
      });
      defender.anim({
        scale: 1,
        time: 150,
      });
      scene.wait(700);
    },
  },
};

/** Our move list: Showdown animations, combined where Showdown splits a move in two. */
export const SHOWDOWN_ANIMS: Record<string, AnimData> = {
  boomburst: showdown.boomburst,
  sludge: showdown.sludge,
  earthquake: showdown.earthquake,
  thunderbolt: showdown.thunderbolt,
  hyperbeam: showdown.hyperbeam,
  // Showdown's Rollout uses its generic "fast attack".
  rollout: showdown.fastattack,
  // Future Sight is a charge (doomdesire) plus a delayed hit (futuresighthit) in Showdown; here they play back to back.
  futuresight: {
    anim(scene, [attacker, defender]) {
      showdown.doomdesire.anim(scene, [attacker, defender]);
      scene.timeOffset = 600;
      showdown.futuresighthit.anim(scene, [defender]);
      scene.timeOffset = 0;
    },
  },
};
