// =============================================================
// SPRITES — pixel art for the player, enemies, and items.
// Each sprite is a list of strings. Each character is one pixel.
// You can edit any letter below to change how things look!
// Color key is at the top of each sprite. "." means transparent.
// =============================================================

// --- Player astronaut (16 wide x 24 tall) ---
// W=white suit  B=blue visor  S=silver helmet rim
// R=red badge   D=dark boots   .=transparent
const PLAYER_SPRITE = {
  scale: 2,            // each pixel becomes a 2x2 square (32x48 on screen)
  colors: {
    W: "#f0f0f5",
    B: "#1d3f7a",
    S: "#a4a8b8",
    R: "#d63a3a",
    D: "#2a2730",
  },
  pixels: [
    "......SSSSSS....",
    "....SSWWWWWWSS..",
    "...SWWWWWWWWWWS.",
    "...SWBBBBBBBBWS.",
    "...SWBBBBBBBBWS.",
    "...SWBBBBBBBBWS.",
    "...SWWWWWWWWWWS.",
    "....WWWWWWWWWW..",
    "...DWWWWWWWWWWD.",
    "..DDWWWWWWWWWWDD",
    "..DWWWWRRWWWWWWD",
    "..DWWWWRRWWWWWWD",
    "..DWWWWWWWWWWWWD",
    "..DWWWWWWWWWWWWD",
    "...WWWWWWWWWWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "..DDDDDD..DDDDDD",
    "..DDDDDD..DDDDDD",
    "..DDDDDD..DDDDDD",
    "................",
  ],
};

// --- Jungle alien (16 wide x 16 tall) ---
// G=green body  D=dark green outline  Y=yellow eye  K=black pupil
// P=pink mouth  L=leaf on top
const ALIEN_SPRITE = {
  scale: 2,
  colors: {
    G: "#3fa84a",
    D: "#1f5c2a",
    Y: "#fff066",
    K: "#0a0a0a",
    P: "#d44a86",
    L: "#7adb5e",
  },
  pixels: [
    ".....LL...LL....",
    "....LLLL.LLLL...",
    "....DDDDDDDD....",
    "...DGGGGGGGGD...",
    "..DGGYYGGYYGGD..",
    "..DGYKYGGYKYGD..",
    "..DGYYYGGYYYGD..",
    "..DGGGGGGGGGGD..",
    "..DGGGPPPPGGGD..",
    "..DGGGPPPPGGGD..",
    "...DGGGGGGGGD...",
    "....DDDDDDDD....",
    "....D.DD.DD.D...",
    "....D.DD.DD.D...",
    "....DDD..DDD....",
    "................",
  ],
};

// --- Desert scavenger alien (16 wide x 16 tall) ---
// T=tan body  D=dark brown outline  R=red goggle lens  K=black pupil
// H=hood gray  M=metal silver buckle
const SCAVENGER_SPRITE = {
  scale: 2,
  colors: {
    T: "#c9905a",
    D: "#5a3018",
    R: "#e44a3a",
    K: "#1a0a04",
    H: "#7a6a5a",
    M: "#c8c8d0",
  },
  pixels: [
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "..HHTTTTTTTTHH..",
    "..HTTTTTTTTTTH..",
    "..HTRRKKKKRRTH..",
    "..HTRRKKKKRRTH..",
    "..HTTTTTTTTTTH..",
    "..HTTTMMMMTTTH..",
    "...DTTTMMTTTD...",
    "...DTTTTTTTTD...",
    "...DTTTTTTTTD...",
    "...DTDDDDDDTD...",
    "...DTDD..DDTD...",
    "...DDD....DDD...",
    "...DD......DD...",
    "................",
  ],
};

// --- Ice critter (16 wide x 16 tall) ---
// W=snow white  C=light cyan body  B=dark blue outline
// K=black eye   R=red mouth        I=icy spike
const ICE_CRITTER_SPRITE = {
  scale: 2,
  colors: {
    W: "#ffffff",
    C: "#a8e0f0",
    B: "#2c4a78",
    K: "#0a0a0a",
    R: "#d44a4a",
    I: "#cfe9f5",
  },
  pixels: [
    "..I..I.II.I..I..",
    "..WWWWWWWWWWWW..",
    ".WWCCCCCCCCCCWW.",
    ".WCCKKCCCCKKCCW.",
    ".WCCKKCCCCKKCCW.",
    ".WCCCCCCCCCCCCW.",
    ".WCCCCRRRRCCCCW.",
    ".WCCCRRRRRRCCCW.",
    ".WCCCCRRRRCCCCW.",
    ".WCCCCCCCCCCCCW.",
    ".BCCCCCCCCCCCCB.",
    ".BBCCCCCCCCCCBB.",
    "..BBBCCCCCCBBB..",
    "....BBBCCBBB....",
    "....BB....BB....",
    "................",
  ],
};

// --- Fire imp (16 wide x 16 tall) ---
// O=orange body  D=dark red outline  Y=yellow eye  K=black pupil
// R=deep red mouth  F=flame tuft on top
const FIRE_IMP_SPRITE = {
  scale: 2,
  colors: {
    O: "#ff7a1a",
    D: "#7a1f0a",
    Y: "#ffe34a",
    K: "#0a0a0a",
    R: "#c81f1f",
    F: "#ffcf4a",
  },
  pixels: [
    ".....FF...FF....",
    "....FFFF.FFFF...",
    "....DDDDDDDD....",
    "...DOOOOOOOOD...",
    "..DOOYYOOYYOOD..",
    "..DOYKYOOYKYOD..",
    "..DOYYYOOYYYOD..",
    "..DOOOOOOOOOOD..",
    "..DOOORRRROOOD..",
    "..DOOORRRROOOD..",
    "...DOOOOOOOOD...",
    "....DDDDDDDD....",
    "....D.DD.DD.D...",
    "....D.DD.DD.D...",
    "....DDD..DDD....",
    "................",
  ],
};

// --- Fire boss (40 wide x 28 tall) — a levitating fire spirit whose face ---
// --- matches its own fire-imp minions: orange skin, flat yellow block   ---
// --- eyes with black pupils, a solid red mouth, a flame tuft on top.    ---
// D=dark outline  O=fire-orange skin/body  Y=eye  K=pupil  R=mouth/hover-trail
// A=stubby arm  C=glowing chest crack  F=flame tuft
const FIRE_BOSS_SPRITE = {
  scale: 4,
  colors: {
    D: "#4a0f08",
    O: "#e8551a",
    Y: "#ffe34a",
    K: "#0a0a0a",
    R: "#b8241a",
    A: "#c8431a",
    C: "#ffb347",
    F: "#ffcf4a",
  },
  pixels: [
    "...FFF............................FFF...",
    "..FFFFF..........................FFFFF..",
    ".......DDDDDDDDDDDDDDDDDDDDDDDDDD.......",
    ".....DDOOOOOOOOOOOOOOOOOOOOOOOOOODD.....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "....DOOOOOYYYYYYYYOOOOYYYYYYYYOOOOOD....",
    "....DOOOOOYYYKKYYYOOOOYYYKKYYYOOOOOD....",
    "....DOOOOOYYYYYYYYOOOOYYYYYYYYOOOOOD....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "....DOOOOOOOORRRRRRRRRRRRRROOOOOOOOD....",
    "....DOOOOOOOORRRRRRRRRRRRRROOOOOOOOD....",
    "....DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD....",
    "......DDDDDDDDDDDDDDDDDDDDDDDDDDDD......",
    ".........DDDDOOOOOOOOOOOOOODDDD.........",
    "........DDDOOOOOOOOOOOOOOOOOODDD........",
    ".........DDOOOOOOOOOOOOOOOOOODD.........",
    "........DDOOOOOOOOOOOOOOOOOOOODD........",
    "...DAAADDOOOOOOOOOOOOOOOOOOOOOODDAAAD...",
    "...DAAADDOOOOOOOOOOOOOOOOOOOOOODDAAAD...",
    "........DOOOOOOOOOOOOOOOOOOOOOOD........",
    "........DOOOCCOOOOOOOOOOOOCCOOOD........",
    "........DOOOCCOOOOOOOOOOOOCCOOOD........",
    "........OOOOOOOOOOOOOOOOOOOOOOOO........",
    ".........DDDDDDDDDD..DDDDDDDDDD.........",
    "..........AAAAAAAA....AAAAAAAA..........",
  ],
};

// --- Bullet (small laser bolt, 6x4) ---
const BULLET_SPRITE = {
  scale: 2,
  colors: { Y: "#ffe34a", O: "#ff8a00", W: "#ffffff" },
  pixels: [
    "..WW..",
    ".OYYO.",
    ".OYYO.",
    "..WW..",
  ],
};

// --- Goal flag (planet rocket / portal, 12 wide x 24 tall) ---
const GOAL_SPRITE = {
  scale: 3,
  colors: {
    P: "#9d6cff",
    L: "#dab8ff",
    D: "#3b1f70",
    W: "#ffffff",
  },
  pixels: [
    "....WW......",
    "...WLLW.....",
    "..WLLLLW....",
    "..WLPPLW....",
    ".WLPPPPLW...",
    ".WPPPPPPW...",
    ".WPPPPPPW...",
    ".WPDDDDPW...",
    ".WPDPPDPW...",
    ".WPDPPDPW...",
    ".WPDDDDPW...",
    ".WPPPPPPW...",
    ".WPPPPPPW...",
    "..WPPPPW....",
    "..WPPPPW....",
    "...WPPW.....",
    "...WPPW.....",
    "..WP..PW....",
    ".WP....PW...",
    "WP......PW..",
  ],
};

// =============================================================
// drawSprite — paints a sprite onto the canvas.
// You probably won't need to change this unless you're curious.
// =============================================================
function drawSprite(ctx, sprite, x, y, flip) {
  const s = sprite.scale;
  for (let row = 0; row < sprite.pixels.length; row++) {
    const line = sprite.pixels[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === "." || ch === " ") continue;
      const color = sprite.colors[ch];
      if (!color) continue;
      const drawCol = flip ? line.length - 1 - col : col;
      ctx.fillStyle = color;
      ctx.fillRect(x + drawCol * s, y + row * s, s, s);
    }
  }
}

// Width and height of a sprite in screen pixels.
function spriteWidth(sprite)  { return sprite.pixels[0].length * sprite.scale; }
function spriteHeight(sprite) { return sprite.pixels.length    * sprite.scale; }
