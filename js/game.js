// =============================================================
// GAME — the main loop, input, camera, and HUD.
// =============================================================

// ---------- TUNABLE NUMBERS ----------
// Change these to make the game feel different!
const GRAVITY           = 0.6;   // how fast you fall
const JUMP_POWER        = 13;    // how high you jump (bigger = higher)
const RUN_JUMP_BOOST    = 1.5;   // extra jump power when holding left/right (jump a bit farther while running)
const MOVE_SPEED        = 4;     // how fast you run
const BULLET_SPEED      = 9;     // how fast bullets fly
const SHOOT_COOLDOWN    = 14;    // frames between shots (60 = 1 sec)
const PLAYER_MAX_HEALTH = 3;
const ENEMY_SPEED       = 1.4;
const ICE_ACCEL         = 0.4;   // how quickly you build speed on ice
const ICE_FRICTION      = 0.92;  // how quickly you stop on ice (1 = never)
const CUTSCENE_DURATION = 300;   // frames the fly-to-next-planet cutscene lasts (5 sec at 60fps)

// ---------- GLOBAL STATE ----------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let player;
let enemies = [];
let bullets = [];
let camera = { x: 0, y: 0 };
let currentLevel = LEVELS[0];
let gameState = "playing"; // "playing" | "won" | "lost" | "cutscene"
let frameCount = 0;
let cutsceneNext = null;   // the level the cutscene is flying us to
let cutsceneTimer = 0;     // frames left in the current cutscene

// ---------- INPUT ----------
const keys = {};
const justPressed = {};

window.addEventListener("keydown", (e) => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.code] = true;
  // Prevent Space and arrow keys from scrolling the page.
  if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => { keys[e.code] = false; });

function readInput() {
  return {
    left:         keys.ArrowLeft  || keys.KeyA,
    right:        keys.ArrowRight || keys.KeyD,
    jumpPressed:  justPressed.Space || justPressed.ArrowUp || justPressed.KeyW,
    shootPressed: justPressed.KeyE,
  };
}

// ---------- LEVEL SETUP ----------
function startLevel(level) {
  currentLevel = level;
  player = createPlayer(level.playerStart.x, level.playerStart.y, level);
  enemies = level.enemies.map(e =>
    createEnemy(e.x, e.y, e.sprite || level.enemySprite, e.health, e.boss, e.speed, e.levitates));
  bullets = [];
  camera.x = 0;
  camera.y = 0;
  gameState = "playing";
}

function nextLevel() {
  const i = LEVELS.indexOf(currentLevel);
  if (i >= 0 && i < LEVELS.length - 1) {
    // Fly to the next planet with a short cutscene instead of cutting straight there.
    cutsceneNext = LEVELS[i + 1];
    cutsceneTimer = CUTSCENE_DURATION;
    gameState = "cutscene";
  } else {
    startLevel(currentLevel);
  }
}

// ---------- MAIN LOOP ----------
function update() {
  frameCount++;

  if (gameState === "cutscene") {
    cutsceneTimer--;
    if (cutsceneTimer <= 0) startLevel(cutsceneNext);
  } else if (gameState !== "playing") {
    if (justPressed.KeyR) {
      if (gameState === "won") nextLevel();
      else startLevel(currentLevel);
    }
  } else {
    const input = readInput();
    updatePlayer(player, currentLevel, input);

    for (const e of enemies) if (e.alive) updateEnemy(e, currentLevel, player);
    for (const b of bullets) if (b.alive) updateBullet(b, currentLevel);

    // Bullet vs enemy
    for (const b of bullets) {
      if (!b.alive) continue;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap(b, e)) {
          e.health--;
          if (e.health <= 0) e.alive = false;
          b.alive = false;
          break;
        }
      }
    }

    // Player vs enemy (touch = take damage)
    for (const e of enemies) {
      if (!e.alive) continue;
      if (rectsOverlap(player, e)) {
        hurtPlayer(player, 1);
        // Knockback
        player.vx = (player.x < e.x ? -1 : 1) * 6;
        player.vy = -7;
      }
    }

    // Player vs goal (bosses must be defeated first)
    const goalRect = goalHitbox(currentLevel);
    const bossAlive = enemies.some(e => e.isBoss && e.alive);
    if (rectsOverlap(player, goalRect) && !bossAlive) gameState = "won";

    if (!player.alive) gameState = "lost";

    // Restart key always works
    if (justPressed.KeyR) startLevel(currentLevel);

    // Camera follows the player, clamped to the level edges.
    const targetX = player.x + player.w / 2 - canvas.width / 2;
    camera.x = Math.max(0, Math.min(targetX, currentLevel.width - canvas.width));
    camera.y = 0;

    // Clean up dead things.
    enemies = enemies.filter(e => e.alive);
    bullets = bullets.filter(b => b.alive);
  }

  // Clear the just-pressed buffer for next frame (every state, so a key
  // press doesn't linger stale across a state change, e.g. into a cutscene).
  for (const k in justPressed) delete justPressed[k];
}

function goalHitbox(level) {
  return {
    x: level.goal.x,
    y: level.goal.y,
    w: spriteWidth(GOAL_SPRITE),
    h: spriteHeight(GOAL_SPRITE),
  };
}

// ---------- DRAWING ----------
function draw() {
  if (gameState === "cutscene") {
    drawCutscene();
    return;
  }
  drawBackground();
  drawMountains();
  drawDunes();
  drawTrees();
  drawPines();
  drawCacti();
  drawPlatforms();
  drawSprite(ctx, GOAL_SPRITE,
             currentLevel.goal.x - camera.x,
             currentLevel.goal.y - camera.y);
  for (const e of enemies) drawEnemy(ctx, e, camera);
  for (const b of bullets) drawBullet(ctx, b, camera);
  drawPlayer(ctx, player, camera);
  drawHUD();
  if (gameState === "won") {
    const i = LEVELS.indexOf(currentLevel);
    const isLast = i === LEVELS.length - 1;
    const hint = isLast ? "Press R to play again" : "Press R for the next planet";
    const title = currentLevel.victoryLevel ? "VICTORY!" : "LEVEL COMPLETE!";
    drawBanner(title, "You earned: " + currentLevel.reward, "#7afc7a", hint);
  }
  if (gameState === "lost") drawBanner("GAME OVER", "Press R to try again", "#ff6a6a", "Press R to restart");
}

function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, currentLevel.skyColor);
  grad.addColorStop(1, currentLevel.fogColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars (parallax — they barely move as the camera scrolls)
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 60; i++) {
    const sx = (i * 137 - camera.x * 0.15) % canvas.width;
    const sy = (i * 53) % 220;
    const x = sx < 0 ? sx + canvas.width : sx;
    ctx.fillRect(x, sy, 2, 2);
  }
}

function drawTrees() {
  if (!currentLevel.trees) return;
  for (const t of currentLevel.trees) {
    // Parallax — far trees move slower than the foreground.
    const px = t.x - camera.x * 0.6;
    if (px < -120 || px > canvas.width + 120) continue;
    // Trunk
    ctx.fillStyle = "#3b2614";
    ctx.fillRect(px - 8, t.y - t.h, 16, t.h);
    // Canopy
    ctx.fillStyle = "#2a6f2f";
    ctx.beginPath();
    ctx.arc(px, t.y - t.h, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3fa84a";
    ctx.beginPath();
    ctx.arc(px - 18, t.y - t.h - 14, 36, 0, Math.PI * 2);
    ctx.arc(px + 22, t.y - t.h - 8,  40, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDunes() {
  if (!currentLevel.dunes) return;
  for (const d of currentLevel.dunes) {
    // Slow parallax — distant dunes drift behind everything.
    const px = d.x - camera.x * 0.4;
    if (px + d.w < -40 || px > canvas.width + 40) continue;
    ctx.fillStyle = "#8a4f2a";
    ctx.beginPath();
    ctx.ellipse(px + d.w / 2, d.y, d.w / 2, d.h, 0, Math.PI, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#d8a766";
    ctx.beginPath();
    ctx.ellipse(px + d.w / 2, d.y + 8, d.w / 2 - 18, d.h - 14, 0, Math.PI, 2 * Math.PI);
    ctx.fill();
  }
}

function drawMountains() {
  if (!currentLevel.mountains) return;
  for (const m of currentLevel.mountains) {
    // Very slow parallax — distant mountains barely move.
    const px = m.x - camera.x * 0.25;
    if (px + m.w < -40 || px > canvas.width + 40) continue;
    const peakX = px + m.w / 2;
    const peakY = m.y - m.h;
    // Mountain body
    ctx.fillStyle = "#5d6e8a";
    ctx.beginPath();
    ctx.moveTo(px, m.y);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(px + m.w, m.y);
    ctx.closePath();
    ctx.fill();
    // Snow cap (top third)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(peakX - m.w * 0.18, peakY + m.h * 0.32);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(peakX + m.w * 0.18, peakY + m.h * 0.32);
    ctx.lineTo(peakX + m.w * 0.10, peakY + m.h * 0.30);
    ctx.lineTo(peakX,             peakY + m.h * 0.40);
    ctx.lineTo(peakX - m.w * 0.10, peakY + m.h * 0.30);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPines() {
  if (!currentLevel.pines) return;
  for (const t of currentLevel.pines) {
    // Mid parallax — closer than mountains, farther than the foreground.
    const px = t.x - camera.x * 0.7;
    if (px < -60 || px > canvas.width + 60) continue;
    // Trunk
    ctx.fillStyle = "#4a2e1a";
    ctx.fillRect(px - 6, t.y - 24, 12, 24);
    // Three layers of pine triangles, top is smallest.
    const layers = 3;
    const totalH = t.h - 24;
    ctx.fillStyle = "#1f5a32";
    for (let i = 0; i < layers; i++) {
      const layerH = totalH / layers + 18;
      const layerY = t.y - 24 - (totalH / layers) * (i + 1);
      const widthAtBase = 70 - i * 14;
      ctx.beginPath();
      ctx.moveTo(px - widthAtBase, layerY + layerH);
      ctx.lineTo(px, layerY);
      ctx.lineTo(px + widthAtBase, layerY + layerH);
      ctx.closePath();
      ctx.fill();
    }
    // Snow on top of each layer
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < layers; i++) {
      const layerY = t.y - 24 - (totalH / layers) * (i + 1);
      const widthAtBase = 70 - i * 14;
      ctx.beginPath();
      ctx.moveTo(px - widthAtBase * 0.55, layerY + 10);
      ctx.lineTo(px, layerY);
      ctx.lineTo(px + widthAtBase * 0.55, layerY + 10);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawCacti() {
  if (!currentLevel.cacti) return;
  for (const c of currentLevel.cacti) {
    // Foreground-ish parallax (a touch slower than the camera).
    const px = c.x - camera.x * 0.85;
    if (px < -60 || px > canvas.width + 60) continue;
    // Trunk
    ctx.fillStyle = "#2f6d3a";
    ctx.fillRect(px - 8, c.y - c.h, 16, c.h);
    // Outline shading
    ctx.fillStyle = "#1f4a26";
    ctx.fillRect(px + 4, c.y - c.h, 4, c.h);
    // Arms (a little one each side)
    const armY = c.y - c.h * 0.55;
    ctx.fillStyle = "#2f6d3a";
    ctx.fillRect(px - 22, armY,        14, 8);
    ctx.fillRect(px - 22, armY - 22,   8, 22);
    ctx.fillRect(px + 8,  armY - 12,   14, 8);
    ctx.fillRect(px + 14, armY - 30,   8, 22);
    // Spines (tiny dots)
    ctx.fillStyle = "#f4e2a8";
    for (let i = 0; i < c.h; i += 8) {
      ctx.fillRect(px - 1, c.y - c.h + i, 2, 2);
    }
  }
}

function drawPlatforms() {
  for (const p of currentLevel.platforms) {
    const x = p.x - camera.x;
    const y = p.y - camera.y;
    if (x + p.w < 0 || x > canvas.width) continue;
    ctx.fillStyle = currentLevel.groundColor;
    ctx.fillRect(x, y, p.w, p.h);
    // Bright top edge
    ctx.fillStyle = currentLevel.groundEdge;
    ctx.fillRect(x, y, p.w, 4);
  }
}

function drawHUD() {
  // Health hearts (drawn as small red squares for now).
  for (let i = 0; i < player.maxHealth; i++) {
    const filled = i < player.health;
    ctx.fillStyle = filled ? "#ff4d6d" : "#3a2030";
    ctx.fillRect(20 + i * 28, 20, 22, 22);
    ctx.fillStyle = filled ? "#ff8aa6" : "#5a3040";
    ctx.fillRect(22 + i * 28, 22, 4, 4);
  }
  // Level name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(currentLevel.name, canvas.width - 20, 36);
  if (enemies.some(e => e.isBoss && e.alive)) {
    ctx.fillStyle = "#ffb347";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Defeat the boss to proceed!", canvas.width - 20, 58);
  }
  ctx.textAlign = "left";
}

function drawBanner(title, subtitle, color, hint) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 220, canvas.width, 160);
  ctx.fillStyle = color;
  ctx.font = "bold 48px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 280);
  ctx.fillStyle = "#e0e0ee";
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText(subtitle, canvas.width / 2, 320);
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "#a0a0b8";
  ctx.fillText(hint || "Press R to restart", canvas.width / 2, 350);
  ctx.textAlign = "left";
}

// ---------- CUTSCENE (flying to the next planet) ----------
function drawCutscene() {
  const elapsed = CUTSCENE_DURATION - cutsceneTimer;
  const progress = elapsed / CUTSCENE_DURATION; // 0 (start) -> 1 (arriving)

  // Deep-space gradient.
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#05020f");
  grad.addColorStop(1, "#160a2e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Streaking stars rushing past, for a sense of speed.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 70; i++) {
    const seedX = (i * 137) % canvas.width;
    const seedY = (i * 71) % canvas.height;
    const speed = 6 + (i % 5) * 3;
    const len = 16 + (i % 4) * 10;
    let x = (seedX - elapsed * speed) % (canvas.width + len);
    if (x < -len) x += canvas.width + len;
    ctx.beginPath();
    ctx.moveTo(x, seedY);
    ctx.lineTo(x + len, seedY);
    ctx.stroke();
  }

  // The planet we left, shrinking away in the corner.
  const originR = Math.max(0, 60 * (1 - progress));
  if (originR > 0) {
    ctx.fillStyle = currentLevel.groundColor;
    ctx.beginPath();
    ctx.arc(70, 90, originR, 0, Math.PI * 2);
    ctx.fill();
  }

  // The destination planet, growing as we approach.
  const destX = canvas.width - 90;
  const destY = canvas.height - 110;
  const destR = 16 + 90 * progress;
  ctx.fillStyle = cutsceneNext.groundColor;
  ctx.beginPath();
  ctx.arc(destX, destY, destR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cutsceneNext.groundEdge;
  ctx.beginPath();
  ctx.arc(destX - destR * 0.3, destY - destR * 0.3, destR * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // The rocket ship, bobbing gently as it flies, nose pointed at the destination planet.
  const bob = Math.sin(frameCount * 0.12) * 8;
  const shipCenterX = canvas.width / 2;
  const shipCenterY = canvas.height / 2 - 15 + bob;
  const shipAngle = Math.atan2(destY - shipCenterY, destX - shipCenterX);
  drawRocketShip(shipCenterX, shipCenterY, shipAngle);

  // Text.
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Blasting off to " + cutsceneNext.name + "...", canvas.width / 2, 70);
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = "#a0a0c8";
  const secondsLeft = Math.max(1, Math.ceil(cutsceneTimer / 60));
  ctx.fillText(secondsLeft + "...", canvas.width / 2, canvas.height - 40);
  ctx.textAlign = "left";
}

// Draws the ship centered at (cx, cy), rotated so its nose points along `angle`
// (a Math.atan2-style angle in radians, 0 = pointing right, -PI/2 = pointing up).
function drawRocketShip(cx, cy, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle + Math.PI / 2); // shape below is drawn nose-up by default

  // Flickering engine flame.
  const flicker = 10 + Math.sin(frameCount * 0.8) * 4;
  ctx.fillStyle = "#ffb347";
  ctx.beginPath();
  ctx.moveTo(-20, 35);
  ctx.lineTo(0, 35 + flicker);
  ctx.lineTo(20, 35);
  ctx.closePath();
  ctx.fill();

  // Body.
  ctx.fillStyle = "#e8e8f0";
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.lineTo(20, 35);
  ctx.lineTo(-20, 35);
  ctx.closePath();
  ctx.fill();

  // Fins.
  ctx.fillStyle = "#d63a3a";
  ctx.beginPath();
  ctx.moveTo(-20, 15);
  ctx.lineTo(-34, 35);
  ctx.lineTo(-20, 35);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(20, 15);
  ctx.lineTo(34, 35);
  ctx.lineTo(20, 35);
  ctx.closePath();
  ctx.fill();

  // Window with the player's helmet visor peeking out.
  ctx.fillStyle = "#a4a8b8";
  ctx.beginPath();
  ctx.arc(0, -5, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d3f7a";
  ctx.beginPath();
  ctx.arc(0, -5, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---------- BOOT ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

startLevel(LEVELS[0]);
loop();
