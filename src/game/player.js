// Masterpiece Anatomical Cyber Shinobi Player
// - Double Jump 360° Acrobatic Ninja Somersault Rotation (ডাবল ক্লিকে স্মুথ ৩৬০° ফ্লিপ)
// - Ultra-Realistic Low-Profile Tactical Slide with Friction Sparks & Trailing Blade
// - Anatomical Articulated Shinobi Runner with Forehead Plate, Dual Visor, Carbon Armor,
//   Split-Toe Tabi Boots, Cyber Ninjato, and Dual Flowing Cloth Scarf.

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
    this.slideHeight = 34;

    // Adaptive position
    this.x = Math.max(50, Math.min(130, Math.floor(canvasWidth * 0.16)));
    this.y = groundY - this.height;
    this.vy = 0;
    this.gravity = 0.82;
    this.jumpForce = -14.6;
    this.doubleJumpForce = -13.0;

    // State & Input Responsiveness
    this.isGrounded = true;
    this.canDoubleJump = true;
    this.jumpCount = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.slideMaxDuration = 0.58;

    // Squash & Stretch Elastic Physics
    this.scaleX = 1.0;
    this.scaleY = 1.0;

    // Somersault Rotation on Double Jump (ডাবল ক্লিকে ৩৬০° অ্যারোবেটিক রোটেশন)
    this.isFlipping = false;
    this.flipAngle = 0;
    this.bodyAngle = 0;
    this.idleTimer = 0;

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
      // First Jump: Powerful athletic leap with upward stretch
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.jumpCount = 1;
      this.canDoubleJump = true;
      this.isSliding = false;
      this.height = this.normalHeight;
      this.isFlipping = false;
      this.flipAngle = 0;

      // Vertical spring
      this.scaleX = 0.84;
      this.scaleY = 1.22;

      sound.playJump();
      if (particleSystem) {
        particleSystem.addJumpBurst(this.x + this.width / 2, this.y + this.height, this.skin.color);
      }
      return true;
    } else if (this.canDoubleJump && this.jumpCount === 1) {
      // Double Jump: 360° Acrobatic Ninja Somersault Flip (ডাবল ক্লিকে নিখুঁত রোটেশন)
      this.vy = this.doubleJumpForce;
      this.jumpCount = 2;
      this.canDoubleJump = false;
      this.totalDoubleJumps++;
      this.isFlipping = true;
      this.flipAngle = 0;

      // Elastic pop stretch
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
      // Fast ninja tactical ground slam dive
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
      this.scaleX = 1.38;
      this.scaleY = 0.65;
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

    // Double Jump 360° Acrobatic Somersault Rotation (ডাবল ক্লিকে স্মুথ ৩৬০° ফ্লিপ)
    if (this.isFlipping) {
      this.flipAngle += dt * 14.5;
      if (this.flipAngle >= Math.PI * 2) {
        this.flipAngle = 0;
        this.isFlipping = false;
      }
    }

    // Slide duration tick & ground sparks
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.stopSlide();
      }
      // Emit slide ground friction sparks & smoke
      if (particleSystem && Math.random() < 0.75) {
        particleSystem.addFootstepDust(this.x + this.width + 12, this.groundY, '#00f5ff');
        particleSystem.addFootstepDust(this.x - 5, this.groundY, '#fbbf24');
      }
    }

    // Elastic spring recovery for Squash & Stretch
    this.scaleX += (1.0 - this.scaleX) * 14 * dt;
    this.scaleY += (1.0 - this.scaleY) * 14 * dt;

    // Physics & Vertical Movement
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;

      // Mid-air body angle when not flipping
      if (!this.isFlipping) {
        this.bodyAngle = Math.min(Math.max(this.vy * 0.025, -0.22), 0.28);
      }

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
        this.scaleX = 1.22;
        this.scaleY = 0.78;

        if (particleSystem) {
          particleSystem.addFootstepDust(this.x + this.width / 2, this.groundY, this.skin.color);
        }
      }
    } else {
      // Ground Running
      this.y = this.groundY - this.height;
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
    const scarfAnchorX = this.x + (this.isSliding ? 14 : 16);
    const scarfAnchorY = this.y + (this.isSliding ? 11 : 19);

    this.scarfPointsA[0].x = scarfAnchorX;
    this.scarfPointsA[0].y = scarfAnchorY;
    this.scarfPointsB[0].x = scarfAnchorX;
    this.scarfPointsB[0].y = scarfAnchorY + 2.5;

    for (let i = 1; i < this.scarfPointsA.length; i++) {
      const prevA = this.scarfPointsA[i - 1];
      const curA = this.scarfPointsA[i];
      const waveA = this.isSliding ? Math.sin(this.idleTimer * 20 - i * 0.8) * 1.5 : Math.sin(this.animTimer * 1.3 - i * 0.65) * (3.0 + i * 1.4);
      const targetAX = prevA.x - (this.isSliding ? 9.5 : 7.0) - Math.min(gameSpeed * 0.65, 8.5);
      const targetAY = prevA.y + waveA * 0.5 + (this.vy * 0.16);
      curA.x += (targetAX - curA.x) * (20 * dt);
      curA.y += (targetAY - curA.y) * (22 * dt);

      const prevB = this.scarfPointsB[i - 1];
      const curB = this.scarfPointsB[i];
      const waveB = this.isSliding ? Math.cos(this.idleTimer * 20 - i * 0.8) * 1.5 : Math.cos(this.animTimer * 1.3 - i * 0.65) * (2.8 + i * 1.2);
      const targetBX = prevB.x - (this.isSliding ? 9.0 : 6.5) - Math.min(gameSpeed * 0.65, 8.0);
      const targetBY = prevB.y + waveB * 0.5 + (this.vy * 0.16) + 2;
      curB.x += (targetBX - curB.x) * (20 * dt);
      curB.y += (targetBY - curB.y) * (22 * dt);
    }

    // Visor Eye Ribbon Light Trail
    const eyeX = this.x + (this.isSliding ? this.width + 12 : this.width / 2 + 11);
    const eyeY = this.y + (this.isSliding ? 8 : 11);
    this.eyeTrails.push({ x: eyeX, y: eyeY, alpha: 0.85 });
    if (this.eyeTrails.length > 6) this.eyeTrails.shift();
    for (const et of this.eyeTrails) {
      et.x -= gameSpeed * 0.4;
      et.alpha -= dt * 3.2;
    }

    // Ghost trails for Speed Boost & High Speed motion blur
    if (activePowerups.speedBoost || this.isFlipping || (!this.isGrounded && Math.abs(this.vy) > 8)) {
      this.ghostTrails.push({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        angle: this.isFlipping ? this.flipAngle : this.bodyAngle,
        alpha: activePowerups.speedBoost ? 0.6 : 0.35,
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
      ctx.globalAlpha = trail.alpha * 0.75;
      ctx.fillStyle = trail.color;
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

    // 4. Center-based Transformation for Squash/Stretch & Somersault Rotation
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scaleX, this.scaleY);

    const hw = this.width / 2;
    const hh = this.height / 2;

    if (this.isFlipping) {
      // --- DOUBLE JUMP: 360° ACROBATIC NINJA SOMERSAULT FLIP ---
      ctx.rotate(this.flipAngle);
      this.drawAcrobaticFlipPose(ctx, hw, hh, skinColor, accentColor);
    } else if (this.isSliding) {
      // --- ULTRA-REALISTIC CINEMATIC TACTICAL SLIDE POSE ---
      this.drawRealisticSlidingPose(ctx, hw, hh, skinColor, accentColor);
    } else {
      // --- ARTICULATED CYBER SHINOBI SPRINT & JUMP POSE ---
      ctx.rotate(this.bodyAngle);
      this.drawArticulatedShinobi(ctx, hw, hh, skinColor, accentColor);
    }

    ctx.restore(); // End center transform

    // 5. Draw Active Power-Up Hologram Auras
    this.drawPowerupAuras(ctx, cx, cy, activePowerups);

    ctx.restore();
  }

  // Draw 360° Acrobatic Tucked Somersault Flip on Double Jump
  drawAcrobaticFlipPose(ctx, hw, hh, skinColor, accentColor) {
    // 1. Glowing Circular Katana Slash Arc (360° প্লাজমা স্লেশ ট্রেইল)
    ctx.save();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI * 0.2, Math.PI * 1.8);
    ctx.stroke();

    // Secondary energy sparks
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI * 0.8, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    // 2. Tucked Shinobi Body Ball (মার্শাল-আর্ট ট্যাকড অ্যাক্রোবেটিক বল)
    ctx.fillStyle = '#0a0a14';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    // Carbon Armor Plates across back
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, -Math.PI * 0.7, Math.PI * 0.3);
    ctx.stroke();

    // Tucked Head & Shinobi Forehead Protector (Hitai-ate)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(4, -14, 11, 5, 1.5);
    ctx.fill();

    // Glowing Visor Eye in Somersault
    ctx.fillStyle = accentColor;
    ctx.fillRect(8, -8, 7, 2.8);

    // Tucked Knees with Knee Guards (Tateage)
    ctx.fillStyle = '#141426';
    ctx.beginPath();
    ctx.arc(-8, 6, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(-8, 6, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Drawn Cyber Ninjato Extended
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(2, 6);
    ctx.lineTo(26, -14);
    ctx.stroke();

    // Sword Hilt (Tsuka)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-4, 11);
    ctx.lineTo(2, 6);
    ctx.stroke();
  }

  // Draw Ultra-Realistic Low-Profile Tactical Slide Pose
  drawRealisticSlidingPose(ctx, hw, hh, skinColor, accentColor) {
    ctx.save();

    // 1. Ground Friction Spark Spray from Boot Sole & Hand
    ctx.save();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    const now = Date.now() / 1000;
    for (let i = 0; i < 4; i++) {
      const sparkLen = 8 + Math.sin(now * 30 + i * 2) * 5;
      const sparkY = hh - 2 + Math.random() * 4;
      ctx.beginPath();
      ctx.moveTo(-hw - 10, sparkY);
      ctx.lineTo(-hw - 10 - sparkLen, sparkY - 3 - Math.random() * 5);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Rear Extended Leg (পিছনের পা সম্পূর্ণ সোজা হয়ে মাটিতে পিছলে যাচ্ছে)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-6, hh - 12);
    ctx.lineTo(-hw - 14, hh - 3);
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0a0a16';
    ctx.stroke();

    // Rear Tabi Boot dragging on bedrock
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.ellipse(-hw - 16, hh - 2, 7, 3, 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Sole Friction Glow
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-hw - 22, hh - 1);
    ctx.lineTo(-hw - 10, hh - 1);
    ctx.stroke();
    ctx.restore();

    // 3. Front Bent Knee & Thigh (সামনের পা ভাঁজ হয়ে নিচু হয়ে আছে)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-4, hh - 12);
    ctx.lineTo(14, hh - 8);
    ctx.lineTo(22, hh - 2);
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#141426';
    ctx.stroke();

    // Knee Guard (Tateage)
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(14, hh - 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Front Tabi Boot planted flat on rock
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.ellipse(24, hh - 1.5, 7, 3.5, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Low-Profile Streamlined Torso & Tactical Armor (নিচু দেহকাণ্ড)
    ctx.fillStyle = '#0a0a14';
    ctx.beginPath();
    ctx.roundRect(-14, hh - 24, 28, 14, 5);
    ctx.fill();

    // Composite Chest Armor Bevels
    ctx.fillStyle = '#111222';
    ctx.beginPath();
    ctx.moveTo(-12, hh - 22);
    ctx.lineTo(12, hh - 22);
    ctx.lineTo(10, hh - 14);
    ctx.lineTo(-10, hh - 14);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Glowing Power Core on Belt
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(0, hh - 16, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // 5. Stabilizing Front Arm (সামনের হাত মাটিতে ভর দিয়ে ব্যালান্স রাখছে)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(10, hh - 20);
    ctx.lineTo(18, hh - 10);
    ctx.lineTo(22, hh - 3);
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#101020';
    ctx.stroke();

    // Knuckle Glove Touching Ground with spark
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.arc(22, hh - 3, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f5ff';
    ctx.fillRect(21, hh - 2, 3, 2);
    ctx.restore();

    // 6. Rear Arm & Trailing Cyber Ninjato Blade (তলোয়ার অনুভূমিকভাবে বাতাস চিরে যাচ্ছে)
    ctx.save();
    const swordHiltX = -10;
    const swordHiltY = hh - 19;
    const swordTipX = -hw - 24;
    const swordTipY = hh - 15;

    // Razor Damascus Steel Blade Edge
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(swordHiltX, swordHiltY);
    ctx.lineTo(swordTipX, swordTipY);
    ctx.stroke();

    // Specular Blade Glint
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(swordHiltX - 4, swordHiltY + 0.6);
    ctx.lineTo(swordTipX + 8, swordTipY - 0.4);
    ctx.stroke();

    // Woven Hilt in hand
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(swordHiltX, swordHiltY);
    ctx.lineTo(swordHiltX + 8, swordHiltY - 2);
    ctx.stroke();
    ctx.restore();

    // 7. Streamlined Shinobi Head (মাথা নিচু করে তীক্ষ্ণ দৃষ্টিতে সামনে ফোকাসড)
    const headX = 14;
    const headY = hh - 26;

    // Cowl Base
    ctx.fillStyle = '#090912';
    ctx.beginPath();
    ctx.arc(headX, headY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Metallic Hitai-ate Forehead Plate in slide
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(headX - 1, headY - 8, 11, 4.5, 1.5);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.fillRect(headX + 4, headY - 6.5, 2.5, 1.8);

    // Sharp Forward-Looking Ocular Slit Visor
    ctx.fillStyle = '#05050c';
    ctx.fillRect(headX + 3, headY - 2, 8, 4);

    ctx.fillStyle = accentColor;
    ctx.fillRect(headX + 4, headY - 1, 6.5, 2.4);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 5, headY - 0.5, 2, 1);

    ctx.restore();
  }

  // Draw Realistic Articulated Cyber Shinobi with Olympic Sprint Biomechanics & Stride Bounce
  drawArticulatedShinobi(ctx, hw, hh, skinColor, accentColor) {
    const isMoving = this.animTimer > 0;
    const phase = isMoving ? this.animTimer : 0;
    const idleBreathing = Math.sin(this.idleTimer * 2.6) * 1.2;

    // Biomechanical Sprint Vertical Oscillation (দৌড়ের সময় প্রাকৃতিক উল্লম্ব বাউন্স)
    const runBounce = (isMoving && this.isGrounded) ? Math.sin(phase * 2) * 3.4 : 0;

    // Running Stride Kinematics
    const legL = Math.sin(phase);
    const legR = Math.sin(phase + Math.PI);
    // Deep knee tuck during recovery swing (পা গুটিয়ে সামনের দিকে নিয়ে আসার গভীর ভাঁজ)
    const kneeBendL = this.isGrounded ? (isMoving ? Math.max(0, -Math.cos(phase)) * 42 : 12) : 22;
    const kneeBendR = this.isGrounded ? (isMoving ? Math.max(0, -Math.cos(phase + Math.PI)) * 42 : 12) : 22;

    // ==========================================
    // A. BACK LEG (Left Leg - Dynamic Push-Off & Recovery Swing)
    // ==========================================
    ctx.save();
    const hipLX = -4;
    const hipLY = 4 + (isMoving ? runBounce : idleBreathing * 0.4);
    const thighAngleL = this.isGrounded ? (isMoving ? legL * 0.82 : -0.15) : -0.32;
    const kneeLX = hipLX + Math.sin(thighAngleL) * 16;
    const kneeLY = hipLY + Math.cos(thighAngleL) * 16;

    // Dynamic Shin angle driven by knee flexion
    const shinAngleL = thighAngleL + kneeBendL * (Math.PI / 180);
    const footLX = kneeLX + Math.sin(shinAngleL) * 17;
    const footLY = kneeLY + Math.cos(shinAngleL) * 17;

    // Muscular Thigh
    ctx.beginPath();
    ctx.moveTo(hipLX, hipLY);
    ctx.lineTo(kneeLX, kneeLY);
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#080814';
    ctx.stroke();

    // Shin with Kyahan Leg Wraps
    ctx.beginPath();
    ctx.moveTo(kneeLX, kneeLY);
    ctx.lineTo(footLX, footLY);
    ctx.lineWidth = 6.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#06060e';
    ctx.stroke();

    // Back Tabi Boot with Dynamic Toe Angle
    const footTiltL = legL > 0 ? 0.35 : -0.25;
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.ellipse(footLX + 3, footLY + 1, 6.5, 3.2, footTiltL, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ==========================================
    // B. CYBER NINJATO (Ninja Sword on Back with Glowing Edge)
    // ==========================================
    ctx.save();
    const swordBaseX = -hw + 4;
    const swordBaseY = -hh + 34 + (isMoving ? runBounce * 0.7 : 0);
    const swordTipX = hw - 2;
    const swordTipY = -hh - 8 + (isMoving ? runBounce * 0.7 : 0);

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
    const torsoY = -hh + 17 + (isMoving ? runBounce : idleBreathing);

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
    ctx.beginPath();
    ctx.arc(0, torsoY + 23.5, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Shuriken Holster Pouches on Belt
    ctx.fillStyle = '#161628';
    ctx.fillRect(-hw + 11, torsoY + 21.5, 4, 4);
    ctx.fillRect(hw - 15, torsoY + 21.5, 4, 4);

    // ==========================================
    // D. FRONT LEG (Right Leg - Ground Strike & High Knee Drive)
    // ==========================================
    ctx.save();
    const hipRX = 4;
    const hipRY = 4 + (isMoving ? runBounce : idleBreathing * 0.4);
    const thighAngleR = this.isGrounded ? (isMoving ? legR * 0.82 : 0.18) : 0.42;
    const kneeRX = hipRX + Math.sin(thighAngleR) * 16;
    const kneeRY = hipRY + Math.cos(thighAngleR) * 16;

    const shinAngleR = thighAngleR + kneeBendR * (Math.PI / 180);
    const footRX = kneeRX + Math.sin(shinAngleR) * 17;
    const footRY = kneeRY + Math.cos(shinAngleR) * 17;

    // Muscular Thigh & Haidate Plate
    ctx.beginPath();
    ctx.moveTo(hipRX, hipRY);
    ctx.lineTo(kneeRX, kneeRY);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#141426';
    ctx.stroke();

    // Articulated Knee Guard (Tateage)
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(kneeRX, kneeRY, 3.6, 0, Math.PI * 2);
    ctx.fill();

    // Lower Shin with Kyahan Leg Wraps
    ctx.beginPath();
    ctx.moveTo(kneeRX, kneeRY);
    ctx.lineTo(footRX, footRY);
    ctx.lineWidth = 6.8;
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
    const footTiltR = legR > 0 ? 0.35 : -0.25;
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.ellipse(footRX + 4, footRY + 1.5, 7.5, 3.6, footTiltR, 0, Math.PI * 2);
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
    // E. SHINOBI HEAD & MASK (দৌড়ের সাথে রিঅ্যাক্টিভ হেড ট্র্যাকিং)
    // ==========================================
    const headX = 4;
    const headY = -hh + 10 + (isMoving ? runBounce * 0.85 : idleBreathing * 0.6);

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

    // Engraved Ninja Clan Sigil in Plate
    ctx.fillStyle = accentColor;
    ctx.fillRect(headX + 3, headY - 6.5, 2.5, 2);

    // 3. Cyberpunk Ocular Visor / Ninja Eyes (Sharp & Focused)
    ctx.fillStyle = '#05050c';
    ctx.fillRect(headX + 2, headY - 1, 9, 4.5);

    ctx.fillStyle = accentColor;
    ctx.fillRect(headX + 4, headY, 7, 2.6);

    // Specular Visor Lens Flare
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 5, headY + 0.4, 2, 1.2);

    // ==========================================
    // F. FRONT ARM & CYBER KUNAI / COMBAT STANCE
    // ==========================================
    ctx.save();
    const armSwing = this.isGrounded ? (isMoving ? -legR * 0.8 : -0.2) : 0.25;
    const shoulderX = 2;
    const shoulderY = -hh + 20 + (isMoving ? runBounce * 0.85 : idleBreathing);
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

  // Draw Cloth Scarf Ribbon Strip
  drawScarfRibbon(ctx, points, color, width) {
    if (points.length < 2) return;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
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
      // Outer subtle energy field ring
      ctx.beginPath();
      ctx.arc(cx, cy, shieldRadius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
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
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.85)';
      ctx.lineWidth = 2;
      ctx.globalAlpha = Math.max(0, 1 - pulse / 45);
      ctx.beginPath();
      ctx.arc(cx, cy, 26 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (activePowerups.speedBoost) {
      ctx.save();
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + this.width, cy);
      ctx.lineTo(cx - 24, cy - 14);
      ctx.lineTo(cx - 24, cy + 14);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 245, 255, 0.18)';
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
