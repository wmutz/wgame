# Space Adventure — Game Spec

A father–son weekend project. A space-themed action platformer where the player flies between 5 unique planets, fights aliens and robots, gains a new ability after each level, and finally faces a boss.

---

## Concept

You're an astronaut traveling the galaxy. On each planet you land, dangerous creatures are waiting. Defeat them (or sneak past), reach the end of the level, and earn a new tool for your arsenal. The fifth planet is a dark, scary world where the final boss lives — and you'll need everything you've collected (plus your most powerful weapon, **nukes**) to defeat it.

**Inspiration:** *Sneaky Sasquatch* (charm, character) + Super Mario Bros. (side-view platforming).

---

## Design constraints

| | |
|---|---|
| Platform | Web browser |
| View | 2D side-scrolling (Mario-style) |
| Mode | Solo player |
| Target play session | ~15 minutes |
| Scope | Weekend project |
| Tech | Vanilla HTML / CSS / JavaScript — no frameworks, no build tools |
| Art | Pixel art (drawn as text grids in code; refine in Piskel later) |

---

## The 5 planets

| # | Planet | Theme | Reward for completing |
|---|---|---|---|
| 1 | **Jungle** | Vines, trees, alien creatures | **Shield** (block hits) |
| 2 | **Desert** | Sand dunes, scavenger aliens | **Homing missile** |
| 3 | **Ice** *(proposed)* | Frozen tundra, slippery floor | **Dash** (zip across the screen) |
| 4 | **Robot Factory** *(proposed)* | Mechanical world, source of the high-tech robots | **TBD** *(suggest: Double Jump)* |
| 5 | **Dark / Scary Planet** | Final boss arena — gets **Nukes** for the fight | Victory |

**Enemies:** aliens dominate planets 1–3, high-tech robots take over planet 4, mix of both on planet 5.

**Open decisions:**
- Planets 3 and 4 themes — confirm or change.
- Planet 4's ability — Double Jump is the strongest fit for a side-scroller; alternatives: bomb (screen-clear), slow-mo, triple-shot.
- Boss design (HP, attack patterns, arena layout).

---

## Player abilities (cumulative)

1. **Blaster** — basic ranged attack, available from start.
2. **Shield** *(after Planet 1)* — temporary damage block.
3. **Homing missile** *(after Planet 2)* — slow but tracks enemies.
4. **Dash** *(after Planet 3)* — short burst forward.
5. **TBD** *(after Planet 4)* — proposed: Double Jump.
6. **Nukes** — final super-weapon, used in the boss fight.

---

## Core mechanics (planet 1 prototype is built around these)

- **Movement:** run left/right, jump (with gravity & terminal velocity).
- **Combat:** shoot bullets in the direction you're facing. Bullets die on hitting platforms or enemies.
- **Hazards:** touching an enemy costs 1 heart and applies knockback. Brief invincibility blink after a hit. Falling off the bottom of the level costs 1 heart and respawns at the start.
- **Enemy AI:** patrol back-and-forth on platforms; turn around at walls and platform edges (no edge falls).
- **Goal:** reach the goal-rocket at the end of the level.
- **Win/lose:** banner overlay, `R` restarts.

---

## Controls

| Key | Action |
|---|---|
| ← → (or A / D) | Move |
| Space (or ↑ / W) | Jump |
| E | Shoot |
| R | Restart current level |

---

## Tech & file structure

```
/workspaces/wgame/
├── index.html
├── style.css
├── gamespec.md          ← this file
└── js/
    ├── sprites.js       ← pixel art as text grids + drawSprite() helper
    ├── levels.js        ← level layouts (platforms, enemies, goal)
    ├── entities.js      ← player, enemy, bullet update + draw
    └── game.js          ← main loop, input, camera, HUD, tunable constants
```

**Run locally:** `python3 -m http.server 8000` from `/workspaces/wgame/`, then open `http://localhost:8000`.

**Tunable constants** (top of `game.js`): `GRAVITY`, `JUMP_POWER`, `MOVE_SPEED`, `BULLET_SPEED`, `SHOOT_COOLDOWN`, `PLAYER_MAX_HEALTH`, `ENEMY_SPEED`. Perfect for letting the kid tweak feel without touching engine code.

---

## Status

### ✅ Built
- Planet 1 (Jungle) playable end-to-end:
  - Side-scrolling level (3200px wide), parallax stars + trees.
  - Astronaut sprite, jungle alien sprite, laser bolt, goal rocket — all editable pixel art in `sprites.js`.
  - Run, jump, shoot, take damage, kill enemies, reach goal, level-complete banner showing the Shield reward.
  - Heart HUD, planet-name HUD.
- Planet 2 (Desert) playable end-to-end:
  - Side-scrolling level (3600px wide) with sandstone ledges, parallax dunes and cacti.
  - New scavenger alien sprite (hooded, red goggles).
  - Level progression: beating Planet 1 takes you to Planet 2; banner shows the Homing Missile reward.
- Planet 3 (Ice) playable end-to-end:
  - Side-scrolling level (4000px wide) with snow-capped pine trees and parallax mountains.
  - New ice critter sprite (icy spikes, red mouth).
  - **Slippery-floor physics** — the player accelerates and glides instead of stopping instantly. Tunable via `ICE_ACCEL` and `ICE_FRICTION` in `game.js`.
  - Banner shows the Dash reward.

### 🔜 Next up
1. **Tune planets 1 → 3** — jump feel, ice friction, enemy placement, anything that doesn't feel right.
2. **Add the abilities system** — shield first, then homing missile, then dash, unlocked as levels progress.
3. **Build planet 4 (Robot Factory)** — robot enemies, new ability (likely Double Jump).
4. **Planet 5** with the boss fight — distinct from levels 1–4 (single arena, multi-phase HP, requires nukes).
5. **Polish:** title screen, planet-select / star map, sound effects, music, save progress between sessions.

---

## Notes for collaboration

The 10-year-old co-creator can safely edit:
- **`js/sprites.js`** — change individual pixel characters to redesign the astronaut, alien, bullet, or goal.
- **`js/levels.js`** — move platforms, change colors, add/remove enemies, make the level longer.
- **Top of `js/game.js`** — tweak gravity, jump power, move speed, etc.

Engine code (collision, camera, game loop) lives in the lower part of `game.js` and `entities.js` — adults touch first.
