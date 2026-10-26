// Player Character implementation for Shadow Runner

import { SKINS_DATA } from '../utils/storage';
import { sound } from './audio';

export class Player {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = groundY;

    // Dimensions
    this.width = 44;
    this.height = 64;
    this.normalHeight = 64;
    this.slideHeight = 36;

    // Position & Physics (Adaptive for small mobile screens to large desktop)
    this.x = Math.max(50, Math.min(120, Math.floor(canvasWidth * 0.15)));
    this.y = groundY - this.height;
    this.vy = 0;
    this.gravity = 0.72;
    this.jumpForce = -13.5;
    this.doubleJumpForce = -12.0;

    // State
    this.isGrounded = true;
    this.canDoubleJump = true;
    this.jumpCount = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.slideMaxDuration = 0.55; // seconds

    // Animation frames & timer
    this.animTimer = 0;
    this.runCycle = 0;
    this.ghostTrails = []; // Motion blur trails

    // Skin & Theme
    this.skinId = 'ninja';
    this.skin = SKINS_DATA[0];

    // Stats
    this.totalDoubleJumps = 0;
    this.invulnerableTimer = 0; // Brief invulnerability after shield break
  }

  setSkin(skinId) {
    this.skinId = skinId;
    const found = SKINS_DATA.find((s) => s.id === skinId);
    if (found) {
      this.skin = found;
    }
  }

  jump(particleSystem) {
    if (this.isGrounded) {
      // First Jump
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.jumpCount = 1;
      this.canDoubleJump = true;
      this.isSliding = false;
      sound.playJump();
      if (particleSystem) {
        particleSystem.addJumpBurst(this.x + this.width / 2, this.y + this.height, this.skin.color);
      }
      return true;
    } else if (this.canDoubleJump && this.jumpCount === 1) {
      // Double Jump
      this.vy = this.doubleJumpForce;
      this.jumpCount = 2;
      this.canDoubleJump = false;
      this.totalDoubleJumps++;
      sound.playDoubleJump();
      if (particleSystem) {
        particleSystem.addDoubleJumpEffect(this.x + this.width / 2, this.y + this.height / 2, this.skin.accent);
      }
      return true;
    }
    return false;
  }

  slide() {
    if (!this.isGrounded) {
      // Fast drop in air
      this.vy = 15;
      return;
    }
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = this.slideMaxDuration;
      this.height = this.slideHeight;
      this.y = this.groundY - this.height;
    }
  }

  stopSlide() {
    if (this.isSliding) {
      this.isSliding = false;
      this.height = this.normalHeight;
      this.y = this.groundY - this.height;
    }
  }

  update(dt, groundY, particleSystem, activePowerups = {}) {
    this.groundY = groundY;

    // Invulnerability tick
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Slide duration tick
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.stopSlide();
      }
    }

    // Apply Gravity
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;

      // Check ground landing
      if (this.y >= this.groundY - this.height) {
        this.y = this.groundY - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.canDoubleJump = true;
        if (particleSystem) {
          particleSystem.addFootstepDust(this.x + this.width / 2, this.y + this.height, this.skin.color);
        }
      }
    } else {
      // Running on ground
      this.y = this.groundY - this.height;
      this.animTimer += dt * 14;
      this.runCycle = Math.sin(this.animTimer);

      if (particleSystem && Math.random() < 0.35) {
        particleSystem.addFootstepDust(this.x + 8, this.y + this.height, this.skin.color);
      }
    }

    // Ghost trails for Speed Boost or high speeds
    if (activePowerups.speedBoost || !this.isGrounded) {
      this.ghostTrails.push({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        alpha: activePowerups.speedBoost ? 0.7 : 0.35,
        color: activePowerups.speedBoost ? '#00f5ff' : this.skin.trailColor,
      });
      if (activePowerups.speedBoost && particleSystem && Math.random() < 0.4) {
        particleSystem.addSpeedTrail(this.x, this.y, this.width, this.height, this.skin.accent);
      }
    }

    // Fade ghost trails
    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      this.ghostTrails[i].alpha -= dt * 2.8;
      this.ghostTrails[i].x -= 4; // drift back
      if (this.ghostTrails[i].alpha <= 0) {
        this.ghostTrails.splice(i, 1);
      }
    }
  }

  // Draw player silhouette, glowing eyes, scarf, and active aura
  draw(ctx, activePowerups = {}) {
    ctx.save();

    // Invulnerability flicker
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Draw ghost trails
    for (const trail of this.ghostTrails) {
      ctx.save();
      ctx.globalAlpha = trail.alpha;
      ctx.fillStyle = trail.color;
      ctx.shadowColor = trail.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(trail.x, trail.y, trail.width, trail.height, 8);
      ctx.fill();
      ctx.restore();
    }

    const px = this.x;
    const py = this.y;
    const pw = this.width;
    const ph = this.height;
    const skinColor = this.skin.color;
    const accentColor = this.skin.accent;

    // --- DRAW RUNNER SILHOUETTE ---
    ctx.shadowColor = skinColor;
    ctx.shadowBlur = activePowerups.speedBoost ? 22 : 12;

    if (this.isSliding) {
      // Sliding ninja pose (low profile)
      ctx.fillStyle = '#0f0f18';
      ctx.beginPath();
      ctx.roundRect(px, py + 8, pw + 12, ph - 8, 6);
      ctx.fill();

      // Glowing body stripe
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 18);
      ctx.lineTo(px + pw + 8, py + 18);
      ctx.stroke();

      // Slid visor/eye
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;
      ctx.fillRect(px + pw + 2, py + 12, 8, 3);
    } else {
      // Standing / Running / Airborne Ninja
      const legOffset = this.isGrounded ? Math.sin(this.animTimer) * 12 : 6;
      const armOffset = this.isGrounded ? -Math.sin(this.animTimer) * 10 : -4;

      // Flowing scarf / cape (waving behind player)
      const scarfWave1 = Math.sin(this.animTimer * 1.5) * 8;
      const scarfWave2 = Math.cos(this.animTimer * 1.8) * 12;
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.moveTo(px + 12, py + 16);
      ctx.quadraticCurveTo(px - 14, py + 22 + scarfWave1, px - 28, py + 28 + scarfWave2);
      ctx.quadraticCurveTo(px - 16, py + 32 + scarfWave1, px + 8, py + 24);
      ctx.closePath();
      ctx.fill();

      // Shadow Torso
      ctx.fillStyle = '#0b0c14';
      ctx.beginPath();
      ctx.roundRect(px + 8, py + 18, pw - 16, ph - 34, 4);
      ctx.fill();

      // Ninja Head
      ctx.beginPath();
      ctx.arc(px + pw / 2 + 2, py + 12, 11, 0, Math.PI * 2);
      ctx.fill();

      // Headband / Visor Glow
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      // Glowing eye slit
      ctx.fillRect(px + pw / 2 + 4, py + 10, 8, 3);
      ctx.fill();

      // Torso Armor Accent
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px + 14, py + 22);
      ctx.lineTo(px + pw - 14, py + 34);
      ctx.moveTo(px + pw - 14, py + 22);
      ctx.lineTo(px + 14, py + 34);
      ctx.stroke();

      // Back Leg
      ctx.fillStyle = '#07070d';
      ctx.beginPath();
      ctx.roundRect(px + 8 - legOffset * 0.4, py + ph - 18, 9, 18, 3);
      ctx.fill();

      // Front Leg
      ctx.fillStyle = '#141422';
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(px + 20 + legOffset * 0.5, py + ph - 18, 9, 18, 3);
      ctx.fill();
      ctx.stroke();

      // Arm / Blade
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 16, py + 24);
      ctx.lineTo(px + 28 + armOffset, py + 36);
      ctx.stroke();
    }

    // --- DRAW ACTIVE POWER-UP AURAS ---

    // 1. Shield Aura (Rotating cyber spherical shield)
    if (activePowerups.shield) {
      const shieldPulse = Math.sin(Date.now() / 150) * 3;
      const shieldRadius = Math.max(pw, ph) * 0.75 + shieldPulse;
      const centerX = px + pw / 2;
      const centerY = py + ph / 2;

      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 20;

      // Outer glowing ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner faint field
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      // Rotating hex shield nodes
      const angleOffset = Date.now() / 400;
      for (let i = 0; i < 4; i++) {
        const nodeAngle = angleOffset + (i * Math.PI) / 2;
        const nx = centerX + Math.cos(nodeAngle) * shieldRadius;
        const ny = centerY + Math.sin(nodeAngle) * shieldRadius;
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Magnet Aura (Pulsing magnetic waves)
    if (activePowerups.magnet) {
      const pulseSize = (Date.now() / 25) % 40;
      ctx.save();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = Math.max(0, 1 - pulseSize / 40);
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, 28 + pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Speed Boost (Lightning sparks / sonic cone)
    if (activePowerups.speedBoost) {
      ctx.save();
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 24;

      // Sonic shock cone
      ctx.beginPath();
      ctx.moveTo(px + pw + 10, py + ph / 2);
      ctx.lineTo(px - 15, py - 6);
      ctx.lineTo(px - 15, py + ph + 6);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // Get precise bounding box for collision detection
  getHitbox() {
    // Tightened hitbox for fair, skill-based gameplay
    const paddingX = 8;
    const paddingTop = 6;
    return {
      x: this.x + paddingX,
      y: this.y + paddingTop,
      width: this.width - paddingX * 2,
      height: this.height - paddingTop - 2,
    };
  }
}
