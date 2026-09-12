// =============================================================
// LEVELS — the layout for each planet.
// Edit anything in here to change the level: move platforms,
// add enemies, change colors, make the level longer, etc.
//
// Coordinates: (0,0) is the TOP-LEFT corner.
//   x grows to the right, y grows downward.
// Each platform is { x, y, w, h }.
// =============================================================

const LEVELS = [
  // ----- LEVEL 1: JUNGLE PLANET -----
  {
    name: "Jungle Planet",
    width: 3200,         // total length of the level
    height: 600,         // canvas height
    skyColor: "#1f3a2c", // background color
    fogColor: "#0f1f1a", // far background tint
    groundColor: "#2d5a2d",
    groundEdge:  "#3fa84a", // bright top edge of platforms
    enemySprite: ALIEN_SPRITE,
    playerStart: { x: 60, y: 400 },

    // Solid platforms the player can stand on.
    platforms: [
      // The main ground (broken up by gaps)
      { x: 0,    y: 540, w: 700,  h: 60 },
      { x: 820,  y: 540, w: 500,  h: 60 },
      { x: 1440, y: 540, w: 600,  h: 60 },
      { x: 2160, y: 540, w: 1040, h: 60 },

      // Floating platforms (jungle trees / vines)
      { x: 320,  y: 420, w: 120, h: 20 },
      { x: 540,  y: 340, w: 120, h: 20 },
      { x: 900,  y: 420, w: 140, h: 20 },
      { x: 1120, y: 320, w: 120, h: 20 },
      { x: 1500, y: 420, w: 140, h: 20 },
      { x: 1700, y: 320, w: 140, h: 20 },
      { x: 1900, y: 420, w: 120, h: 20 },
      { x: 2300, y: 380, w: 160, h: 20 },
      { x: 2560, y: 280, w: 140, h: 20 },
      { x: 2800, y: 380, w: 200, h: 20 },
    ],

    // Enemies to place. y is the platform top they stand on
    // (so 540 = ground, 320 = top of a platform whose y is 320).
    enemies: [
      { x: 480,  y: 540 },
      { x: 980,  y: 540 },
      { x: 1180, y: 320 },
      { x: 1620, y: 540 },
      { x: 1820, y: 540 },
      { x: 2050, y: 540 },
      { x: 2380, y: 380 },
      { x: 2700, y: 540 },
      { x: 2950, y: 380 },
    ],

    // Decorative trees in the background (just for looks).
    trees: [
      { x: 100, y: 540, h: 200 },
      { x: 250, y: 540, h: 260 },
      { x: 700, y: 540, h: 220 },
      { x: 1050, y: 540, h: 280 },
      { x: 1380, y: 540, h: 240 },
      { x: 1750, y: 540, h: 300 },
      { x: 2100, y: 540, h: 240 },
      { x: 2450, y: 540, h: 280 },
      { x: 2900, y: 540, h: 260 },
    ],

    // Where the goal is. Touching it finishes the level.
    goal: { x: 3060, y: 480 },

    // What you get for completing this planet.
    reward: "Shield",
  },

  // ----- LEVEL 2: DESERT PLANET -----
  {
    name: "Desert Planet",
    width: 3600,
    height: 600,
    skyColor: "#f4a96b", // orange dawn
    fogColor: "#7a3a2e", // red sunset haze
    groundColor: "#b88248",
    groundEdge:  "#e8c878", // bright sand on top
    enemySprite: SCAVENGER_SPRITE,
    playerStart: { x: 60, y: 400 },

    // Solid platforms — sandstone ledges and broken ground.
    platforms: [
      // Main ground (with gaps you can fall through)
      { x: 0,    y: 540, w: 600,  h: 60 },
      { x: 740,  y: 540, w: 360,  h: 60 },
      { x: 1240, y: 540, w: 280,  h: 60 },
      { x: 1660, y: 540, w: 460,  h: 60 },
      { x: 2260, y: 540, w: 380,  h: 60 },
      { x: 2780, y: 540, w: 820,  h: 60 },

      // Sandstone steps and floating rocks
      { x: 260,  y: 460, w: 100, h: 20 },
      { x: 420,  y: 380, w: 100, h: 20 },
      { x: 600,  y: 320, w: 120, h: 20 },
      { x: 820,  y: 420, w: 140, h: 20 },
      { x: 1060, y: 340, w: 120, h: 20 },
      { x: 1280, y: 420, w: 120, h: 20 },
      { x: 1480, y: 340, w: 140, h: 20 },
      { x: 1740, y: 420, w: 140, h: 20 },
      { x: 1960, y: 340, w: 120, h: 20 },
      { x: 2160, y: 260, w: 120, h: 20 },
      { x: 2380, y: 380, w: 140, h: 20 },
      { x: 2580, y: 300, w: 140, h: 20 },
      { x: 2820, y: 420, w: 140, h: 20 },
      { x: 3040, y: 340, w: 160, h: 20 },
      { x: 3280, y: 260, w: 160, h: 20 },
    ],

    // Scavenger aliens patrolling the dunes.
    enemies: [
      { x: 380,  y: 540 },
      { x: 660,  y: 320 },
      { x: 880,  y: 540 },
      { x: 1120, y: 340 },
      { x: 1340, y: 540 },
      { x: 1540, y: 340 },
      { x: 1820, y: 540 },
      { x: 2020, y: 340 },
      { x: 2220, y: 260 },
      { x: 2440, y: 380 },
      { x: 2640, y: 300 },
      { x: 2900, y: 540 },
      { x: 3120, y: 340 },
      { x: 3340, y: 260 },
    ],

    // Cacti decorations in the foreground.
    cacti: [
      { x: 180, y: 540, h: 90 },
      { x: 700, y: 540, h: 70 },
      { x: 1180, y: 540, h: 110 },
      { x: 1600, y: 540, h: 80 },
      { x: 2120, y: 540, h: 100 },
      { x: 2700, y: 540, h: 90 },
      { x: 3200, y: 540, h: 110 },
    ],

    // Sand dune silhouettes in the background.
    dunes: [
      { x: 0,    y: 540, w: 600,  h: 120 },
      { x: 500,  y: 540, w: 700,  h: 160 },
      { x: 1100, y: 540, w: 800,  h: 140 },
      { x: 1700, y: 540, w: 900,  h: 180 },
      { x: 2400, y: 540, w: 700,  h: 130 },
      { x: 3000, y: 540, w: 700,  h: 170 },
    ],

    // Where the goal is. Touching it finishes the level.
    goal: { x: 3460, y: 480 },

    // What you get for completing this planet.
    reward: "Homing missile",
  },

  // ----- LEVEL 3: ICE PLANET -----
  {
    name: "Ice Planet",
    width: 4000,
    height: 600,
    skyColor: "#cfe6f5", // pale winter sky
    fogColor: "#3d5a7a", // dim blue horizon
    groundColor: "#9bc8df", // ice
    groundEdge:  "#ffffff", // snow on top of every platform
    enemySprite: ICE_CRITTER_SPRITE,
    slippery: true,         // <-- makes the floor slide!
    playerStart: { x: 60, y: 400 },

    // Wider main platforms than usual since ice makes landing tricky.
    platforms: [
      { x: 0,    y: 540, w: 800,  h: 60 },
      { x: 940,  y: 540, w: 600,  h: 60 },
      { x: 1680, y: 540, w: 700,  h: 60 },
      { x: 2520, y: 540, w: 540,  h: 60 },
      { x: 3200, y: 540, w: 800,  h: 60 },

      // Floating ice platforms (placed generously).
      { x: 280,  y: 440, w: 160, h: 20 },
      { x: 520,  y: 360, w: 160, h: 20 },
      { x: 1060, y: 420, w: 160, h: 20 },
      { x: 1280, y: 320, w: 180, h: 20 },
      { x: 1780, y: 420, w: 160, h: 20 },
      { x: 2020, y: 320, w: 160, h: 20 },
      { x: 2240, y: 240, w: 160, h: 20 },
      { x: 2620, y: 380, w: 180, h: 20 },
      { x: 2860, y: 280, w: 180, h: 20 },
      { x: 3300, y: 420, w: 180, h: 20 },
      { x: 3540, y: 320, w: 180, h: 20 },
    ],

    // A bit fewer enemies — sliding into one is already punishing.
    enemies: [
      { x: 380,  y: 540 },
      { x: 600,  y: 360 },
      { x: 1120, y: 420 },
      { x: 1340, y: 320 },
      { x: 1840, y: 540 },
      { x: 2080, y: 320 },
      { x: 2300, y: 240 },
      { x: 2700, y: 380 },
      { x: 2940, y: 280 },
      { x: 3380, y: 420 },
      { x: 3620, y: 320 },
    ],

    // Snow-capped pine trees in the foreground.
    pines: [
      { x: 160,  y: 540, h: 200 },
      { x: 720,  y: 540, h: 240 },
      { x: 1500, y: 540, h: 220 },
      { x: 2440, y: 540, h: 260 },
      { x: 3080, y: 540, h: 230 },
      { x: 3760, y: 540, h: 250 },
    ],

    // Distant snowy mountains in the background.
    mountains: [
      { x: 0,    y: 540, w: 700,  h: 240 },
      { x: 600,  y: 540, w: 900,  h: 320 },
      { x: 1400, y: 540, w: 800,  h: 280 },
      { x: 2100, y: 540, w: 1000, h: 360 },
      { x: 3000, y: 540, w: 800,  h: 300 },
      { x: 3700, y: 540, w: 700,  h: 260 },
    ],

    // Where the goal is. Touching it finishes the level.
    goal: { x: 3860, y: 480 },

    // What you get for completing this planet.
    reward: "Dash",
  },

  // ----- LEVEL 4: FIRE PLANET -----
  {
    name: "Fire Planet",
    victoryLevel: true, // shows "VICTORY!" instead of "LEVEL COMPLETE!" on the win banner
    width: 3000,
    height: 600,
    skyColor: "#3a0f0f",  // smoldering dusk
    fogColor: "#7a1f0f",  // distant lava glow
    groundColor: "#2a1810", // charred rock
    groundEdge:  "#ff6a2a", // glowing lava edge
    enemySprite: FIRE_IMP_SPRITE,
    playerStart: { x: 60, y: 400 },

    // Player is buffed on this planet: faster, jumps higher, more hearts.
    // (Normal defaults, set in game.js, are moveSpeed 4 and jumpPower 13.)
    moveSpeed: 5.5,
    jumpPower: 15,
    maxHealth: 5,

    // No pits, no floating platforms — just one long stretch of solid
    // ground leading to the boss.
    platforms: [
      { x: 0, y: 540, w: 3000, h: 60 },
    ],

    // A few fire imps along the way, then the fire boss guarding the goal.
    enemies: [
      { x: 500,  y: 540 },
      { x: 900,  y: 540 },
      { x: 1300, y: 540 },
      { x: 1700, y: 540 },
      { x: 2100, y: 540 },
      { x: 2560, y: 540, sprite: FIRE_BOSS_SPRITE, health: 20, boss: true, speed: 2.6 },
    ],

    // Where the goal is. Touching it finishes the level.
    goal: { x: 2880, y: 480 },

    // What you get for completing this planet.
    reward: "Double Jump",
  },
];
