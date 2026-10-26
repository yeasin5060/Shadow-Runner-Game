// High-Performance Anatomical Ninja Player with Procedural Kinematics,
// Squash & Stretch, 360° Somersault, and Dynamic Cloth Scarf Physics.

import { SKINS_DATA } from '../utils/storage';
import { sound } from './audio';

export class Player {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = groundY;

    // Dimensions
    this.width = 46;
    this.height = 66;
    this.normalHeight = 66;
    this.slideHeight = 36;

    // Adaptive position
    this.x = Math.max(50, Math.min(130, Math.floor(canvasWidth * 0.16)));
    this.y = groundY - this.height;
    this.vy = 0;
    this.gravity = 0.74;
    this.jumpForce = -13.8;
    this.doubleJumpForce = -12.4;

    // State & Input Responsiveness
    this.isGrounded = true;
    this.canDoubleJump = true;
    this.jumpCount = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.slideMaxDuration = 0.55;

    // Squash & Stretch Elastic Physics
    this.scaleX = 1.0;
    this.scaleY = 1.0;

    // Rotation & Somersault Animation
    this.isFlipping = false;
    this.flipAngle = 0;
    this.bodyAngle = 0;

    // Procedural Running Stride Cycle
    this.animTimer = 0;
    this.runSpeed = 16;
    this.ghostTrails = [];

    // Realistic Multi-Point Cloth Scarf Simulation
    this.scarfPoints = [];
    for (let i = 0; i < 7; i++) {
      this.scarfPoints.push({
        x: this.x - i * 6,
        y: this.y + 18,
        vy: 0,
      });
    }

    // Visor Ribbon Trail
    this.eyeTrails = [];

    // Skin & Theme
    this.skinId = 'ninja';
    this.skin = SKINS_DATA[0];

    // Stats
    this.totalDoubleJumps = 0;
    this.invulnerableTimer = 0;
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
      // First Jump with elastic squash & stretch anticipation
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.jumpCount = 1;
      this.canDoubleJump = true;
      this.isSliding = false;
      this.height = this.normalHeight;

      // Vertical stretch
      this.scaleX = 0.82;
      this.scaleY = 1.25;

      sound.playJump();
      if (particleSystem) {
        particleSystem.addJumpBurst(this.x + this.width / 2, this.y + this.height, this.skin.color);
      }
      return true;
    } else if (this.canDoubleJump && this.jumpCount === 1) {
      // Double Jump with 360° Acrobatic Somersault Flip
      this.vy = this.doubleJumpForce;
      this.jumpCount = 2;
      this.canDoubleJump = false;
      this.totalDoubleJumps++;
      this.isFlipping = true;
      this.flipAngle = 0;

      // Pop stretch
      this.scaleX = 1.15;
      this.scaleY = 1.15;

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
      // Fast ninja dive drop
      this.vy = 18;
      this.scaleX = 0.75;
      this.scaleY = 1.35;
      return;
    }
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = this.slideMaxDuration;
      this.height = this.slideHeight;
      this.y = this.groundY - this.height;
      this.scaleX = 1.35;
      this.scaleY = 0.7;
    }
  }

  stopSlide() {
    if (this.isSliding) {
      this.isSliding = false;
      this.height = this.normalHeight;
      this.y = this.groundY - this.height;
      this.scaleX = 0.9;
      this.scaleY = 1.1;
    }
  }

  update(dt, groundY, particleSystem, activePowerups = {}, gameSpeed = 6) {
    this.groundY = groundY;

    // Invulnerability decay
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Slide duration tick
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.stopSlide();
      }
      // Emit slide ground friction sparks
      if (particleSystem && Math.random() < 0.6) {
        particleSystem.addFootstepDust(this.x + this.width + 5, this.groundY, '#00f5ff');
      }
    }

    // Elastic spring recovery for Squash & Stretch (Hooke's law damper)
    this.scaleX += (1.0 - this.scaleX) * 14 * dt;
    this.scaleY += (1.0 - this.scaleY) * 14 * dt;

    // Double Jump Somersault Rotation
    if (this.isFlipping) {
      this.flipAngle += dt * 16;
      if (this.flipAngle >= Math.PI * 2) {
        this.flipAngle = 0;
        this.isFlipping = false;
      }
    }

    // Physics & Vertical Movement
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;

      // Tilt body according to velocity
      this.bodyAngle = Math.min(Math.max(this.vy * 0.03, -0.35), 0.45);

      // Landing check
      if (this.y >= this.groundY - this.height) {
        this.y = this.groundY - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.canDoubleJump = true;
        this.isFlipping = false;
        this.flipAngle = 0;

        // Landing Impact Cushion (Squash)
        this.scaleX = 1.25;
        this.scaleY = 0.75;

        if (particleSystem) {
          particleSystem.addFootstepDust(this.x + this.width / 2, this.groundY, this.skin.color);
        }
      }
    } else {
      // Ground Running
      this.y = this.groundY - this.height;
      this.bodyAngle = 0.12 + Math.min(gameSpeed * 0.015, 0.2); // Forward athletic sprint lean

      // Advance running stride cycle
      this.runSpeed = 13 + gameSpeed * 0.8;
      this.animTimer += dt * this.runSpeed;

      // Footstep dust when front foot impacts
      if (particleSystem && Math.sin(this.animTimer) > 0.92) {
        particleSystem.addFootstepDust(this.x + 12, this.groundY, this.skin.color);
      }
    }

    // Update Multi-Point Cloth Scarf Simulation
    const scarfAnchorX = this.x + (this.isSliding ? 10 : 16);
    const scarfAnchorY = this.y + (this.isSliding ? 14 : 20);

    this.scarfPoints[0].x = scarfAnchorX;
    this.scarfPoints[0].y = scarfAnchorY;

    for (let i = 1; i < this.scarfPoints.length; i++) {
      const prev = this.scarfPoints[i - 1];
      const cur = this.scarfPoints[i];

      // Natural wave undulating frequency
      const wave = Math.sin(this.animTimer * 1.4 - i * 0.7) * (3.5 + i * 1.5);
      const targetX = prev.x - 7.5 - Math.min(gameSpeed * 0.7, 9);
      const targetY = prev.y + wave * 0.6 + (this.vy * 0.18);

      cur.x += (targetX - cur.x) * (20 * dt);
      cur.y += (targetY - cur.y) * (22 * dt);
    }

    // Visor Eye Glow Ribbon Trail
    const eyeX = this.x + (this.isSliding ? this.width + 4 : this.width / 2 + 8);
    const eyeY = this.y + (this.isSliding ? 14 : 12);
    this.eyeTrails.push({ x: eyeX, y: eyeY, alpha: 0.8 });
    if (this.eyeTrails.length > 7) this.eyeTrails.shift();
    for (const et of this.eyeTrails) {
      et.x -= gameSpeed * 0.45;
      et.alpha -= dt * 3;
    }

    // Ghost trails for Speed Boost & High Speed motion blur
    if (activePowerups.speedBoost || !this.isGrounded) {
      this.ghostTrails.push({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        angle: this.isFlipping ? this.flipAngle : this.bodyAngle,
        alpha: activePowerups.speedBoost ? 0.65 : 0.35,
        color: activePowerups.speedBoost ? '#00f5ff' : this.skin.trailColor,
      });

      if (activePowerups.speedBoost && particleSystem && Math.random() < 0.4) {
        particleSystem.addSpeedTrail(this.x, this.y, this.width, this.height, this.skin.accent);
      }
    }

    // Fade ghost trails
    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      this.ghostTrails[i].alpha -= dt * 3.2;
      this.ghostTrails[i].x -= gameSpeed * 0.35;
      if (this.ghostTrails[i].alpha <= 0) {
        this.ghostTrails.splice(i, 1);
      }
    }
  }

  // Draw Runner with Articulated Limbs, Dynamic Scarf & Light Trails
  draw(ctx, activePowerups = {}) {
    ctx.save();

    // Invulnerability flicker
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 70) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const skinColor = this.skin.color;
    const accentColor = this.skin.accent;

    // 1. Draw Eye Ribbon Light Trails
    ctx.save();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < this.eyeTrails.length; i++) {
      const pt = this.eyeTrails[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Draw Ghost Trails
    for (const trail of this.ghostTrails) {
      ctx.save();
      ctx.globalAlpha = trail.alpha;
      ctx.fillStyle = trail.color;
      ctx.shadowColor = trail.color;
      ctx.shadowBlur = 14;
      ctx.translate(trail.x + trail.width / 2, trail.y + trail.height / 2);
      ctx.scale(trail.scaleX, trail.scaleY);
      ctx.rotate(trail.angle);
      ctx.beginPath();
      ctx.roundRect(-trail.width / 2, -trail.height / 2, trail.width, trail.height, 8);
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Dynamic Cloth Scarf (Under body)
    ctx.save();
    ctx.fillStyle = skinColor;
    ctx.strokeStyle = skinColor;
    ctx.shadowColor = skinColor;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.scarfPoints[0].x, this.scarfPoints[0].y - 3);
    for (let i = 1; i < this.scarfPoints.length; i++) {
      const p = this.scarfPoints[i];
      ctx.lineTo(p.x, p.y - (3 - i * 0.4));
    }
    for (let i = this.scarfPoints.length - 1; i >= 0; i--) {
      const p = this.scarfPoints[i];
      ctx.lineTo(p.x, p.y + (3 - i * 0.3));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Center-based Transformation for Squash/Stretch & Somersault Flip
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scaleX, this.scaleY);

    if (this.isFlipping) {
      ctx.rotate(this.flipAngle);
    } else {
      ctx.rotate(this.bodyAngle);
    }

    const hw = this.width / 2;
    const hh = this.height / 2;

    ctx.shadowColor = skinColor;
    ctx.shadowBlur = activePowerups.speedBoost ? 24 : 14;

    if (this.isSliding) {
      // --- SLIDING POSE ---
      ctx.fillStyle = '#0a0a14';
      ctx.beginPath();
      ctx.roundRect(-hw - 8, -hh + 6, this.width + 16, this.height - 8, 8);
      ctx.fill();

      // Neon Chassis Line
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-hw, 0);
      ctx.lineTo(hw + 8, 0);
      ctx.stroke();

      // Sliding Visor Eye
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 12;
      ctx.fillRect(hw, -6, 9, 3.5);
    } else {
      // --- ARTICULATED ANATOMICAL RUNNER POSE ---
      const phase = this.animTimer;
      const legL = Math.sin(phase);
      const legR = Math.sin(phase + Math.PI);
      const kneeL = Math.max(0, -Math.cos(phase)) * 22;
      const kneeR = Math.max(0, -Math.cos(phase + Math.PI)) * 22;

      // A. Back Leg (Left)
      ctx.save();
      ctx.fillStyle = '#06060c';
      ctx.strokeStyle = '#121220';
      ctx.lineWidth = 1.5;
      const hipLX = -4;
      const hipLY = 4;
      const thighAngleL = this.isGrounded ? legL * 0.7 : -0.3;
      const kneeLX = hipLX + Math.sin(thighAngleL) * 14;
      const kneeLY = hipLY + Math.cos(thighAngleL) * 14;
      const footLX = kneeLX + Math.sin(thighAngleL + kneeL * 0.03) * 15;
      const footLY = kneeLY + Math.cos(thighAngleL + kneeL * 0.03) * 15;

      ctx.beginPath();
      ctx.moveTo(hipLX, hipLY);
      ctx.lineTo(kneeLX, kneeLY);
      ctx.lineTo(footLX, footLY);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#080812';
      ctx.stroke();
      ctx.restore();

      // B. Torso & Armor Vest
      ctx.fillStyle = '#0b0c16';
      ctx.beginPath();
      ctx.roundRect(-hw + 8, -hh + 18, this.width - 16, this.height - 34, 5);
      ctx.fill();

      // Armor Specular Highlights & Trim
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-hw + 12, -hh + 24);
      ctx.lineTo(hw - 12, -hh + 34);
      ctx.moveTo(hw - 12, -hh + 24);
      ctx.lineTo(-hw + 12, -hh + 34);
      ctx.stroke();

      // Belt & Energy Core
      ctx.fillStyle = skinColor;
      ctx.fillRect(-hw + 10, -hh + 38, this.width - 20, 3);
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -hh + 39.5, 3, 0, Math.PI * 2);
      ctx.fill();

      // C. Front Leg (Right - with Shin Armor)
      ctx.save();
      const hipRX = 4;
      const hipRY = 4;
      const thighAngleR = this.isGrounded ? legR * 0.7 : 0.4;
      const kneeRX = hipRX + Math.sin(thighAngleR) * 14;
      const kneeRY = hipRY + Math.cos(thighAngleR) * 14;
      const footRX = kneeRX + Math.sin(thighAngleR + kneeR * 0.03) * 15;
      const footRY = kneeRY + Math.cos(thighAngleR + kneeR * 0.03) * 15;

      ctx.beginPath();
      ctx.moveTo(hipRX, hipRY);
      ctx.lineTo(kneeRX, kneeRY);
      ctx.lineTo(footRX, footRY);
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#141424';
      ctx.stroke();

      // Shin Guard Accent
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = skinColor;
      ctx.beginPath();
      ctx.moveTo(kneeRX, kneeRY);
      ctx.lineTo(footRX, footRY);
      ctx.stroke();
      ctx.restore();

      // D. Ninja Head
      ctx.fillStyle = '#0d0d1a';
      ctx.beginPath();
      ctx.arc(4, -hh + 11, 11, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Eye Slit Visor
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 14;
      ctx.fillRect(7, -hh + 9, 8, 3.2);

      // E. Arm & Cyber Blade
      ctx.save();
      const armSwing = this.isGrounded ? -legR * 0.7 : 0.2;
      const shoulderX = 2;
      const shoulderY = -hh + 22;
      const elbowX = shoulderX + Math.sin(armSwing) * 12;
      const elbowY = shoulderY + Math.cos(armSwing) * 12;
      const handX = elbowX + Math.sin(armSwing - 0.4) * 11;
      const handY = elbowY + Math.cos(armSwing - 0.4) * 11;

      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(elbowX, elbowY);
      ctx.lineTo(handX, handY);
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#101020';
      ctx.stroke();

      // Kunai / Cyber Energy Dagger in hand
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + 10, handY + 6);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore(); // End center transform

    // 5. Draw Active Power-Up Hologram Auras
    if (activePowerups.shield) {
      const shieldRadius = Math.max(this.width, this.height) * 0.78 + Math.sin(Date.now() / 140) * 3;
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 22;

      ctx.beginPath();
      ctx.arc(cx, cy, shieldRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.fill();

      // Rotating hex vertices
      const angle = Date.now() / 350;
      for (let i = 0; i < 4; i++) {
        const a = angle + (i * Math.PI) / 2;
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * shieldRadius, cy + Math.sin(a) * shieldRadius, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (activePowerups.magnet) {
      const pulse = (Date.now() / 22) % 45;
      ctx.save();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 14;
      ctx.globalAlpha = Math.max(0, 1 - pulse / 45);
      ctx.beginPath();
      ctx.arc(cx, cy, 26 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (activePowerups.speedBoost) {
      ctx.save();
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 26;

      ctx.beginPath();
      ctx.moveTo(cx + this.width, cy);
      ctx.lineTo(cx - 24, cy - 14);
      ctx.lineTo(cx - 24, cy + 14);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 245, 255, 0.15)';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  getHitbox() {
    const paddingX = 7;
    const paddingTop = 6;
    return {
      x: this.x + paddingX,
      y: this.y + paddingTop,
      width: this.width - paddingX * 2,
      height: this.height - paddingTop - 2,
    };
  }
}
