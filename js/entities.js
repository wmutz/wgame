// =============================================================
// ENTITIES — the player, enemies, and bullets.
// Each one is just a plain object made by a "create" function.
// The "update" functions move them and handle their behavior.
// =============================================================

// ---------- PLAYER ----------
function createPlayer(x, y, level) {
  // A level can override the player's move speed, jump power, and max
  // health (e.g. the Fire Planet makes the player faster/jumpier/heartier).
  const maxHealth = (level && level.maxHealth) || PLAYER_MAX_HEALTH;
  return {
    kind: "player",
    x, y,
    w: spriteWidth(PLAYER_SPRITE),
    h: spriteHeight(PLAYER_SPRITE),
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,           // 1 = right, -1 = left
    moveSpeed: (level && level.moveSpeed) || MOVE_SPEED,
    jumpPower: (level && level.jumpPower) || JUMP_POWER,
    maxHealth,
    health: maxHealth,
    invincible: 0,       // frames of invincibility after being hit
    shootCooldown: 0,
    alive: true,
  };
}

function updatePlayer(p, level, input) {
  // --- Horizontal movement ---
  if (level.slippery) {
    // Ice physics: accelerate toward moveSpeed, glide when no input.
    if (input.left) {
      p.vx -= ICE_ACCEL;
      if (p.vx < -p.moveSpeed) p.vx = -p.moveSpeed;
      p.facing = -1;
    } else if (input.right) {
      p.vx += ICE_ACCEL;
      if (p.vx >  p.moveSpeed) p.vx =  p.moveSpeed;
      p.facing = 1;
    } else {
      p.vx *= ICE_FRICTION;
      if (Math.abs(p.vx) < 0.05) p.vx = 0;
    }
  } else {
    if (input.left)  { p.vx = -p.moveSpeed; p.facing = -1; }
    else if (input.right) { p.vx =  p.moveSpeed; p.facing =  1; }
    else p.vx = 0;
  }

  // --- Jumping ---
  if (input.jumpPressed && p.onGround) {
    const running = input.left || input.right;
    p.vy = -(p.jumpPower + (running ? RUN_JUMP_BOOST : 0));
    p.onGround = false;
  }

  // --- Gravity ---
  p.vy += GRAVITY;
  if (p.vy > 16) p.vy = 16; // terminal velocity so we don't tunnel

  // --- Move and collide with platforms ---
  moveAndCollide(p, level.platforms);

  // --- Shooting ---
  if (p.shootCooldown > 0) p.shootCooldown--;
  if (input.shootPressed && p.shootCooldown === 0) {
    p.shootCooldown = SHOOT_COOLDOWN;
    spawnBullet(p);
  }

  // --- Invincibility blink countdown ---
  if (p.invincible > 0) p.invincible--;

  // --- Falling off the world = lose a heart and respawn ---
  if (p.y > level.height + 200) {
    hurtPlayer(p, 1);
    p.x = level.playerStart.x;
    p.y = level.playerStart.y;
    p.vx = 0; p.vy = 0;
  }
}

function hurtPlayer(p, amount) {
  if (p.invincible > 0) return;
  p.health -= amount;
  p.invincible = 60; // 1 second
  if (p.health <= 0) {
    p.health = 0;
    p.alive = false;
  }
}

function drawPlayer(ctx, p, camera) {
  // Blink while invincible
  if (p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0) return;
  drawSprite(ctx, PLAYER_SPRITE, p.x - camera.x, p.y - camera.y, p.facing < 0);
}

// ---------- ENEMY (per-level sprite) ----------
function createEnemy(x, y, sprite, health, isBoss, speed) {
  const spr = sprite || ALIEN_SPRITE;
  const w = spriteWidth(spr);
  const h = spriteHeight(spr);
  const hp = health || 1;
  const spd = speed || ENEMY_SPEED;
  return {
    kind: "enemy",
    sprite: spr,
    x: x - w / 2,            // x in level data is the center
    y: y - h,                // y is the feet, so subtract height
    w, h,
    vx: -spd,
    vy: 0,
    onGround: false,
    health: hp,
    maxHealth: hp,
    isBoss: !!isBoss,
    speed: spd,
    alive: true,
  };
}

function updateEnemy(e, level, player) {
  // Gravity
  e.vy += GRAVITY;
  if (e.vy > 16) e.vy = 16;

  // Chase the player: move toward whichever side they're on.
  let desiredVx = 0;
  if (player && player.alive) {
    desiredVx = (player.x + player.w / 2 > e.x + e.w / 2) ? e.speed : -e.speed;
  }

  // Don't chase off a platform edge: peek ahead at our feet before moving.
  if (e.onGround && desiredVx !== 0) {
    const probeX = desiredVx > 0 ? e.x + e.w + 2 : e.x - 2;
    const probeY = e.y + e.h + 2;
    let groundAhead = false;
    for (const plat of level.platforms) {
      if (probeX >= plat.x && probeX <= plat.x + plat.w &&
          probeY >= plat.y && probeY <= plat.y + plat.h) {
        groundAhead = true; break;
      }
    }
    if (!groundAhead) desiredVx = 0;
  }
  e.vx = desiredVx;

  moveAndCollide(e, level.platforms);
}

function drawEnemy(ctx, e, camera) {
  drawSprite(ctx, e.sprite, e.x - camera.x, e.y - camera.y, e.vx > 0);
  if (e.isBoss) drawBossHealthBar(ctx, e, camera);
}

function drawBossHealthBar(ctx, e, camera) {
  const barW = e.w;
  const x = e.x - camera.x;
  const y = e.y - camera.y - 14;
  ctx.fillStyle = "#3a1010";
  ctx.fillRect(x, y, barW, 8);
  ctx.fillStyle = "#ff4d2a";
  ctx.fillRect(x, y, barW * (e.health / e.maxHealth), 8);
}

// ---------- BULLET ----------
function createBullet(x, y, dir) {
  return {
    kind: "bullet",
    x, y,
    w: spriteWidth(BULLET_SPRITE),
    h: spriteHeight(BULLET_SPRITE),
    vx: BULLET_SPEED * dir,
    vy: 0,
    alive: true,
    life: 90, // disappears after 1.5 seconds even if it hits nothing
  };
}

function spawnBullet(p) {
  const bw = spriteWidth(BULLET_SPRITE);
  const bx = p.facing > 0 ? p.x + p.w : p.x - bw;
  const by = p.y + p.h * 0.45;
  bullets.push(createBullet(bx, by, p.facing));
}

function updateBullet(b, level) {
  b.x += b.vx;
  b.life--;
  if (b.life <= 0) b.alive = false;

  // Bullets die when they hit a platform.
  for (const plat of level.platforms) {
    if (rectsOverlap(b, plat)) { b.alive = false; return; }
  }

  // Off the level = gone.
  if (b.x < -50 || b.x > level.width + 50) b.alive = false;
}

function drawBullet(ctx, b, camera) {
  drawSprite(ctx, BULLET_SPRITE, b.x - camera.x, b.y - camera.y, b.vx < 0);
}

// =============================================================
// COLLISION HELPERS
// =============================================================
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// Move an entity by its velocity, stopping it at solid platforms.
// Sets entity.onGround to true if it landed on something this frame.
function moveAndCollide(entity, platforms) {
  // Horizontal first
  entity.x += entity.vx;
  for (const p of platforms) {
    if (rectsOverlap(entity, p)) {
      if (entity.vx > 0)      entity.x = p.x - entity.w;
      else if (entity.vx < 0) entity.x = p.x + p.w;
      entity.vx = 0;
    }
  }
  // Then vertical
  entity.y += entity.vy;
  entity.onGround = false;
  for (const p of platforms) {
    if (rectsOverlap(entity, p)) {
      if (entity.vy > 0) {
        entity.y = p.y - entity.h;
        entity.onGround = true;
      } else if (entity.vy < 0) {
        entity.y = p.y + p.h;
      }
      entity.vy = 0;
    }
  }
}
