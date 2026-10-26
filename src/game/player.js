// Masterpiece Anatomical Cyber Shinobi Player
// Realistic Proportions, Shinobi Cowl & Headband, Ocular Visor, Segmented Armor,
// Articulated Tabi Boots & Calf Wraps, Cyber Ninjato Blade, Dual Cloth Scarf,
// and Rock-Solid Forward-Facing Shinobi Focus (No Disorienting Head Spin).

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

    // Stable Body & Forward-Facing Head Angle (মাথা সোজা ও ফোকাসড থাকবে, কখনোই ঘুরবে না)
    this.bodyAngle = 0;
    this.idleTimer = 0;

    // Double Jump Air Dash Surge (মাথা না ঘুরিয়ে অ্যাথলেটিক শ্যাডো ড্যাশ লিপ)
    this.isAirSurging = false;
    this.airSurgeTimer = 0;

    // Procedural Running Stride Cycle
    this.animTimer = 0;
    this.runSpeed = 16;
    this.ghostTrails = [];

    // Realistic Dual-Tail Flowing Cloth Scarf Simulation
    this.scarfPointsA = [];
    this.scarfPointsB = [];
    for (let i = 0; i < 7; i++) {
      this.scarfPointsA.push({ x: this.x - i * 6.5, y: this.y + 19 });
      this.scarfPointsB.push({ x: this.x - i * 6.0, y: this.y + 22 });
    }

    // Visor Eye Ribbon Trail
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
      // First Jump with elastic anticipation
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.jumpCount = 1;
      this.canDoubleJump = true;
      this.isSliding = false;
      this.height = this.normalHeight;

      // Vertical spring
      this.scaleX = 0.84;
      this.scaleY = 1.22;

      sound.playJump();
      if (particleSystem) {
        particleSystem.addJumpBurst(this.x + this.width / 2, this.y + this.height, this.skin.color);
      }
      return true;
    } else if (this.canDoubleJump && this.jumpCount === 1) {
      // Double Jump with High-Tech Shadow Dash Surge (মাথা ঘোরে না, সামনে স্থির ফোকাস)
      this.vy = this.doubleJumpForce;
      this.jumpCount = 2;
      this.canDoubleJump = false;
      this.totalDoubleJumps++;
      this.isAirSurging = true;
      this.airSurgeTimer = 0.35;

      // Explosive kinetic pop stretch
      this.scaleX = 1.18;
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
      // Fast ninja tactical ground slam
      this.vy = 18;
      this.scaleX = 0.78;
      this.scaleY = 1.32;
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
      this.scaleX = 0.92;
      this.scaleY = 1.08;
    }
  }

  update(dt, groundY, particleSystem, activePowerups = {}, gameSpeed = 6) {
    this.groundY = groundY;
    this.idleTimer += dt;

    // Invulnerability decay
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Air surge timer decay
    if (this.isAirSurging) {
      this.airSurgeTimer -= dt;
      if (this.airSurgeTimer <= 0) {
        this.isAirSurging = false;
      }
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

    // Physics & Vertical Movement
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;

      // Realistic aerial tuck posture: steady and athletic (মাথা সোজা ও সামনে ফোকাসড)
      this.bodyAngle = Math.min(Math.max(this.vy * 0.025, -0.22), 0.28);

      // Landing check
      if (this.y >= this.groundY - this.height) {
        this.y = this.groundY - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.canDoubleJump = true;
        this.isAirSurging = false;

        // Landing Impact Cushion (Squash)
        this.scaleX = 1.22;
        this.scaleY = 0.78;

        if (particleSystem) {
          particleSystem.addFootstepDust(this.x + this.width / 2, this.groundY, this.skin.color);
        }
      }
    } else {
      // Ground Running
      this.y = this.groundY - this.height;
      // Controlled forward athletic sprint lean (মাথা সবসময় দৃঢ়ভাবে সামনে তাকানো)
      this.bodyAngle = 0.09 + Math.min(gameSpeed * 0.012, 0.16);

      // Advance running stride cycle
      this.runSpeed = 12 + gameSpeed * 0.8;
      this.animTimer += dt * this.runSpeed;

      // Footstep dust when front foot strikes the ground
      if (particleSystem && Math.sin(this.animTimer) > 0.94) {
        particleSystem.addFootstepDust(this.x + 10, this.groundY, this.skin.color);
      }
    }

    // Update Dual-Tail Flowing Cloth Scarf Simulation
    const scarfAnchorX = this.x + (this.isSliding ? 12 : 16);
    const scarfAnchorY = this.y + (this.isSliding ? 14 : 19);

    this.scarfPointsA[0].x = scarfAnchorX;
    this.scarfPointsA[0].y = scarfAnchorY;
    this.scarfPointsB[0].x = scarfAnchorX;
    this.scarfPointsB[0].y = scarfAnchorY + 2.5;

    for (let i = 1; i < this.scarfPointsA.length; i++) {
      const prevA = this.scarfPointsA[i - 1];
      const curA = this.scarfPointsA[i];
      const waveA = Math.sin(this.animTimer * 1.3 - i * 0.65) * (3.0 + i * 1.4);
      const targetAX = prevA.x - 7.0 - Math.min(gameSpeed * 0.65, 8.5);
      const targetAY = prevA.y + waveA * 0.5 + (this.vy * 0.16);
      curA.x += (targetAX - curA.x) * (20 * dt);
      curA.y += (targetAY - curA.y) * (22 * dt);

      const prevB = this.scarfPointsB[i - 1];
      const curB = this.scarfPointsB[i];
      const waveB = Math.cos(this.animTimer * 1.3 - i * 0.65) * (2.8 + i * 1.2);
      const targetBX = prevB.x - 6.5 - Math.min(gameSpeed * 0.65, 8.0);
      const targetBY = prevB.y + waveB * 0.5 + (this.vy * 0.16) + 2;
      curB.x += (targetBX - curB.x) * (20 * dt);
      curB.y += (targetBY - curB.y) * (22 * dt);
    }

    // Visor Eye Ribbon Light Trail (মাথার সাথে সুনির্দিষ্টভাবে নোঙর করা)
    const eyeX = this.x + (this.isSliding ? this.width + 4 : this.width / 2 + 11);
    const eyeY = this.y + (this.isSliding ? 12 : 11);
    this.eyeTrails.push({ x: eyeX, y: eyeY, alpha: 0.85 });
    if (this.eyeTrails.length > 6) this.eyeTrails.shift();
    for (const et of this.eyeTrails) {
      et.x -= gameSpeed * 0.4;
      et.alpha -= dt * 3.2;
    }

    // Ghost trails for Speed Boost & High Speed motion blur
    if (activePowerups.speedBoost || this.isAirSurging || (!this.isGrounded && Math.abs(this.vy) > 8)) {
      this.ghostTrails.push({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        angle: this.bodyAngle,
        alpha: activePowerups.speedBoost ? 0.6 : 0.3,
        color: activePowerups.speedBoost ? '#00f5ff' : this.skin.trailColor,
      });

      if (activePowerups.speedBoost && particleSystem && Math.random() < 0.4) {
        particleSystem.addSpeedTrail(this.x, this.y, this.width, this.height, this.skin.accent);
      }
    }

    // Fade ghost trails
    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      this.ghostTrails[i].alpha -= dt * 3.4;
      this.ghostTrails[i].x -= gameSpeed * 0.35;
      if (this.ghostTrails[i].alpha <= 0) {
        this.ghostTrails.splice(i, 1);
      }
    }
  }

  // Draw Realistic Cyber Shinobi Runner with High-Definition Anatomy
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
    ctx.lineWidth = 2.2;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < this.eyeTrails.length; i++) {
      const pt = this.eyeTrails[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Draw Speed Ghost Trails
    for (const trail of this.ghostTrails) {
      ctx.save();
      ctx.globalAlpha = trail.alpha;
      ctx.fillStyle = trail.color;
      ctx.shadowColor = trail.color;
      ctx.shadowBlur = 12;
      ctx.translate(trail.x + trail.width / 2, trail.y + trail.height / 2);
      ctx.scale(trail.scaleX, trail.scaleY);
      ctx.rotate(trail.angle);
      ctx.beginPath();
      ctx.roundRect(-trail.width / 2, -trail.height / 2, trail.width, trail.height, 8);
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Dynamic Dual-Tail Cloth Scarf (Under body, billowing behind)
    ctx.save();
    this.drawScarfRibbon(ctx, this.scarfPointsA, skinColor, 4.2);
    this.drawScarfRibbon(ctx, this.scarfPointsB, skinColor, 3.2);
    ctx.restore();

    // 4. Center-based Transformation for Squash/Stretch & Athletic Sprint Lean
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scaleX, this.scaleY);

    // Stable Forward-Facing Body Angle (মাথা সবসময় সামনে স্থির ও ফোকাসড থাকবে)
    ctx.rotate(this.bodyAngle);

    const hw = this.width / 2;
    const hh = this.height / 2;

    ctx.shadowColor = skinColor;
    ctx.shadowBlur = activePowerups.speedBoost ? 22 : 12;

    if (this.isSliding) {
      // --- REALISTIC TACTICAL SLIDING POSE ---
      this.drawSlidingPose(ctx, hw, hh, skinColor, accentColor);
    } else {
      // --- REALISTIC ARTICULATED CYBER SHINOBI POSE ---
      this.drawArticulatedShinobi(ctx, hw, hh, skinColor, accentColor);
    }

    ctx.restore(); // End center transform

    // 5. Draw Active Power-Up Hologram Auras
    this.drawPowerupAuras(ctx, cx, cy, activePowerups);

    ctx.restore();
  }

  // Draw Realistic Articulated Cyber Shinobi (Anatomy, Armor, Forehead Guard & Weapon)
  drawArticulatedShinobi(ctx, hw, hh, skinColor, accentColor) {
    const isMoving = this.animTimer > 0;
    const phase = isMoving ? this.animTimer : 0;
    const idleBreathing = Math.sin(this.idleTimer * 2.6) * 1.2;

    // Running Stride Kinematics
    const legL = Math.sin(phase);
    const legR = Math.sin(phase + Math.PI);
    const kneeL = Math.max(0, -Math.cos(phase)) * 24;
    const kneeR = Math.max(0, -Math.cos(phase + Math.PI)) * 24;

    // ==========================================
    // A. BACK LEG (Left Leg)
    // ==========================================
    ctx.save();
    const hipLX = -4;
    const hipLY = 4 + (isMoving ? 0 : idleBreathing * 0.4);
    const thighAngleL = this.isGrounded ? (isMoving ? legL * 0.72 : -0.15) : -0.32;
    const kneeLX = hipLX + Math.sin(thighAngleL) * 15;
    const kneeLY = hipLY + Math.cos(thighAngleL) * 15;
    const footLX = kneeLX + Math.sin(thighAngleL + (isMoving ? kneeL * 0.03 : 0.2)) * 16;
    const footLY = kneeLY + Math.cos(thighAngleL + (isMoving ? kneeL * 0.03 : 0.2)) * 16;

    // Dark Ninja Shinobi Pants
    ctx.beginPath();
    ctx.moveTo(hipLX, hipLY);
    ctx.lineTo(kneeLX, kneeLY);
    ctx.lineTo(footLX, footLY);
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#080812';
    ctx.stroke();

    // Back Tabi Boot
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.ellipse(footLX + 3, footLY + 1, 6, 3, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ==========================================
    // B. CYBER NINJATO (Ninja Sword Sheath / Blade on Back)
    // ==========================================
    ctx.save();
    const swordBaseX = -hw + 4;
    const swordBaseY = -hh + 34;
    const swordTipX = hw - 2;
    const swordTipY = -hh - 8;

    // Scabbard (Saya)
    ctx.strokeStyle = '#05050c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(swordBaseX, swordBaseY);
    ctx.lineTo(swordTipX, swordTipY);
    ctx.stroke();

    // Glowing Plasma Edge Hamon Line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(swordBaseX + 2, swordBaseY - 2);
    ctx.lineTo(swordTipX, swordTipY);
    ctx.stroke();

    // Woven Hilt (Tsuka) & Pommel
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(swordBaseX - 6, swordBaseY + 6);
    ctx.lineTo(swordBaseX, swordBaseY);
    ctx.stroke();

    // Square Tsuba Guard
    ctx.fillStyle = '#1e1e2f';
    ctx.fillRect(swordBaseX - 2, swordBaseY - 3, 4, 6);
    ctx.restore();

    // ==========================================
    // C. TORSO & SEGMENTED TACTICAL SHINOBI ARMOR
    // ==========================================
    const torsoY = -hh + 17 + (isMoving ? 0 : idleBreathing);

    // Dark Undergarment Tunic
    ctx.fillStyle = '#0a0a14';
    ctx.beginPath();
    ctx.roundRect(-hw + 8, torsoY, this.width - 16, this.height - 35, 6);
    ctx.fill();

    // Carbon-Fiber Composite Chest Plate (Beveled Plates)
    ctx.fillStyle = '#111222';
    ctx.beginPath();
    ctx.moveTo(-hw + 10, torsoY + 3);
    ctx.lineTo(hw - 10, torsoY + 3);
    ctx.lineTo(hw - 12, torsoY + 16);
    ctx.lineTo(-hw + 12, torsoY + 16);
    ctx.closePath();
    ctx.fill();

    // Specular Armor Accent Lining
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Crossed Tactical Shoulder Harness
    ctx.strokeStyle = '#1d1d32';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-hw + 11, torsoY + 4);
    ctx.lineTo(hw - 12, torsoY + 22);
    ctx.moveTo(hw - 11, torsoY + 4);
    ctx.lineTo(-hw + 12, torsoY + 22);
    ctx.stroke();

    // Tactical Obi Sash / Utility Belt
    ctx.fillStyle = '#06060c';
    ctx.fillRect(-hw + 9, torsoY + 21, this.width - 18, 5);

    // Glowing Biometric Power Core Reactor
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, torsoY + 23.5, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Shuriken Holster Pouches on Belt
    ctx.fillStyle = '#161628';
    ctx.fillRect(-hw + 11, torsoY + 21.5, 4, 4);
    ctx.fillRect(hw - 15, torsoY + 21.5, 4, 4);

    // ==========================================
    // D. FRONT LEG (Right Leg - with Shin Guards & Tabi Boots)
    // ==========================================
    ctx.save();
    const hipRX = 4;
    const hipRY = 4 + (isMoving ? 0 : idleBreathing * 0.4);
    const thighAngleR = this.isGrounded ? (isMoving ? legR * 0.72 : 0.18) : 0.42;
    const kneeRX = hipRX + Math.sin(thighAngleR) * 15;
    const kneeRY = hipRY + Math.cos(thighAngleR) * 15;
    const footRX = kneeRX + Math.sin(thighAngleR + (isMoving ? kneeR * 0.03 : 0.1)) * 16;
    const footRY = kneeRY + Math.cos(thighAngleR + (isMoving ? kneeR * 0.03 : 0.1)) * 16;

    // Muscular Thigh & Haidate Plate
    ctx.beginPath();
    ctx.moveTo(hipRX, hipRY);
    ctx.lineTo(kneeRX, kneeRY);
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#141426';
    ctx.stroke();

    // Articulated Knee Guard (Tateage)
    ctx.fillStyle = skinColor;
    ctx.shadowColor = skinColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(kneeRX, kneeRY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower Shin with Kyahan Leg Wraps
    ctx.beginPath();
    ctx.moveTo(kneeRX, kneeRY);
    ctx.lineTo(footRX, footRY);
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f0f1c';
    ctx.stroke();

    // Shin Guard Cyber Trim Line
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(kneeRX, kneeRY);
    ctx.lineTo(footRX, footRY);
    ctx.stroke();

    // Split-Toe Ninja Tabi Boot with High-Traction Carbon Sole
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.ellipse(footRX + 4, footRY + 1.5, 7, 3.5, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Tabi Sole Accent Line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(footRX - 2, footRY + 4);
    ctx.lineTo(footRX + 9, footRY + 4);
    ctx.stroke();
    ctx.restore();

    // ==========================================
    // E. SHINOBI HEAD & MASK (মাথা সবসময় সোজা, স্থির এবং দৃঢ়ভাবে সামনে তাকানো)
    // ==========================================
    const headX = 4;
    const headY = -hh + 10 + (isMoving ? 0 : idleBreathing * 0.6);

    // 1. Ninja Cowl / Hood Base
    ctx.fillStyle = '#0a0a14';
    ctx.beginPath();
    ctx.arc(headX, headY, 11, 0, Math.PI * 2);
    ctx.fill();

    // Cowl Chin / Mempo Face Mask
    ctx.fillStyle = '#10111e';
    ctx.beginPath();
    ctx.moveTo(headX - 6, headY + 3);
    ctx.lineTo(headX + 9, headY + 3);
    ctx.lineTo(headX + 6, headY + 11);
    ctx.lineTo(headX - 4, headY + 11);
    ctx.closePath();
    ctx.fill();

    // 2. Metallic Shinobi Forehead Protector Plate (Hitai-ate - হিটাই-আতে প্লেট)
    const plateGrad = ctx.createLinearGradient(headX - 5, headY - 8, headX + 10, headY - 3);
    plateGrad.addColorStop(0, '#334155');
    plateGrad.addColorStop(0.5, '#64748b');
    plateGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.roundRect(headX - 2, headY - 8, 12, 5, 1.5);
    ctx.fill();

    // Plate Corner Metal Rivets
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(headX - 1, headY - 7, 1.5, 1.5);
    ctx.fillRect(headX + 7, headY - 7, 1.5, 1.5);

    // Engraved Ninja Clan Sigil / Cyber Symbol in Plate
    ctx.fillStyle = accentColor;
    ctx.fillRect(headX + 3, headY - 6.5, 2.5, 2);

    // 3. High-Definition Cyberpunk Ocular Visor / Ninja Eyes (Sharp & Focused Ahead)
    // Dual-Optic Tactical Slit Visor Frame
    ctx.fillStyle = '#05050c';
    ctx.fillRect(headX + 2, headY - 1, 9, 4.5);

    // Luminous Ocular Core Lens (মাথা না ঘুরিয়ে তীব্র তীক্ষ্ণ দৃষ্টিতে সামনে তাকানো)
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 14;
    ctx.fillRect(headX + 4, headY, 7, 2.6);

    // Specular Visor Lens Flare
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.fillRect(headX + 5, headY + 0.4, 2, 1.2);

    // ==========================================
    // F. FRONT ARM & CYBER KUNAI / COMBAT STANCE
    // ==========================================
    ctx.save();
    const armSwing = this.isGrounded ? (isMoving ? -legR * 0.72 : -0.2) : 0.25;
    const shoulderX = 2;
    const shoulderY = -hh + 20 + (isMoving ? 0 : idleBreathing);
    const elbowX = shoulderX + Math.sin(armSwing) * 12;
    const elbowY = shoulderY + Math.cos(armSwing) * 12;
    const handX = elbowX + Math.sin(armSwing - 0.45) * 11;
    const handY = elbowY + Math.cos(armSwing - 0.45) * 11;

    // Shoulder Pauldron Guard
    ctx.fillStyle = '#141424';
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(shoulderX, shoulderY, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Forearm with Vambrace Guard
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(handX, handY);
    ctx.lineWidth = 4.8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111122';
    ctx.stroke();

    // Stealth Ninja Knuckle Glove
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.arc(handX, handY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cyber Kunai Dagger in Hand
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.4;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(handX + 11, handY + 6);
    ctx.stroke();

    // Kunai Ring Pommel
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(handX - 2, handY - 1, 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Realistic Tactical Low-Profile Slide Pose
  drawSlidingPose(ctx, hw, hh, skinColor, accentColor) {
    // Low-slung chassis
    ctx.fillStyle = '#0a0a16';
    ctx.beginPath();
    ctx.roundRect(-hw - 8, -hh + 6, this.width + 16, this.height - 8, 8);
    ctx.fill();

    // Armor Specular Seam
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-hw - 4, -hh + 12);
    ctx.lineTo(hw + 10, -hh + 12);
    ctx.stroke();

    // Forehead Plate in slide
    ctx.fillStyle = '#475569';
    ctx.fillRect(hw - 2, -hh + 8, 8, 4);

    // Glowing Forward-Looking Visor Eye
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 14;
    ctx.fillRect(hw + 4, -hh + 9, 8, 2.8);

    // Cyber Blade angled backwards slicing the air
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-hw - 4, -hh + 14);
    ctx.lineTo(-hw - 22, -hh + 8);
    ctx.stroke();
  }

  // Draw Cloth Scarf Ribbon Strip
  drawScarfRibbon(ctx, points, color, width) {
    if (points.length < 2) return;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y - width * 0.5);
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      ctx.lineTo(p.x, p.y - (width * 0.5 - i * 0.3));
    }
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      ctx.lineTo(p.x, p.y + (width * 0.5 - i * 0.2));
    }
    ctx.closePath();
    ctx.fill();
  }

  // Draw Holographic Power-Up Auras
  drawPowerupAuras(ctx, cx, cy, activePowerups) {
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
