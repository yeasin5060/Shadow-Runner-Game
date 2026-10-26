// Parallax Background and Atmosphere Renderer for Shadow Runner

export class ParallaxBackground {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.groundY = groundY;

    this.offsetLayer1 = 0; // Far mountains/skyline (factor 0.1)
    this.offsetLayer2 = 0; // Midground trees/ruins (factor 0.35)
    this.offsetGround = 0; // Foreground terrain (factor 1.0)
    this.fogOffset = 0;

    // Ambient floating embers/motes
    this.ambientMotes = [];
    for (let i = 0; i < 40; i++) {
      this.ambientMotes.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (groundY - 40),
        size: 1 + Math.random() * 2.5,
        speedX: 0.5 + Math.random() * 1.5,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }

    // Dynamic Cinematic Speed Wind Streaks
    this.windStreaks = [];
    for (let i = 0; i < 16; i++) {
      this.windStreaks.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * groundY,
        length: 25 + Math.random() * 50,
        speed: 12 + Math.random() * 18,
        alpha: 0.1 + Math.random() * 0.25,
      });
    }
  }

  resize(w, h, groundY) {
    this.width = w;
    this.height = h;
    this.groundY = groundY;
  }

  update(gameSpeed, dt) {
    this.offsetLayer1 = (this.offsetLayer1 + gameSpeed * 0.12) % this.width;
    this.offsetLayer2 = (this.offsetLayer2 + gameSpeed * 0.38) % this.width;
    this.offsetGround = (this.offsetGround + gameSpeed) % 40;
    this.fogOffset = (this.fogOffset + gameSpeed * 0.7) % this.width;

    // Ambient motes drift
    for (const mote of this.ambientMotes) {
      mote.x -= mote.speedX + gameSpeed * 0.25;
      mote.y += mote.speedY;

      if (mote.x < -10) {
        mote.x = this.width + 10;
        mote.y = Math.random() * (this.groundY - 40);
      }
    }

    // High Speed Wind Streaks
    for (const streak of this.windStreaks) {
      streak.x -= streak.speed + gameSpeed * 1.2;
      if (streak.x + streak.length < -20) {
        streak.x = this.width + Math.random() * 100;
        streak.y = Math.random() * this.groundY;
        streak.length = 30 + Math.random() * 60;
      }
    }
  }

  draw(ctx, levelTheme) {
    const w = this.width;
    const h = this.height;
    const gy = this.groundY;

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, gy);
    skyGrad.addColorStop(0, levelTheme.skyGradient[0]);
    skyGrad.addColorStop(0.5, levelTheme.skyGradient[1]);
    skyGrad.addColorStop(1, levelTheme.skyGradient[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Celestial Moon & Volumetric Rays
    const moonX = w * 0.78;
    const moonY = h * 0.22;
    const moonRadius = Math.min(55, w * 0.12);

    ctx.save();
    // Soft atmospheric glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2.8);
    moonGlow.addColorStop(0, levelTheme.moonGlow);
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Volumetric Light Cone
    const rayGrad = ctx.createLinearGradient(moonX, moonY, moonX - 100, gy);
    rayGrad.addColorStop(0, levelTheme.moonGlow);
    rayGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(moonX - moonRadius * 0.7, moonY);
    ctx.lineTo(moonX - 250, gy);
    ctx.lineTo(moonX + 100, gy);
    ctx.lineTo(moonX + moonRadius * 0.7, moonY);
    ctx.closePath();
    ctx.fill();

    // Moon Disc
    ctx.fillStyle = levelTheme.moonColor;
    ctx.shadowColor = levelTheme.moonColor;
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle moon crater detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.arc(moonX - 14, moonY + 8, 12, 0, Math.PI * 2);
    ctx.arc(moonX + 16, moonY - 10, 9, 0, Math.PI * 2);
    ctx.arc(moonX + 5, moonY + 18, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Layer 1: Distant Jagged Mountains / Cyber Skyline
    ctx.save();
    ctx.fillStyle = levelTheme.mountainColor;
    this.drawSkyline(ctx, this.offsetLayer1, gy - 70, 110, 0.4);
    ctx.restore();

    // 4. Layer 2: Midground Gothic Pines / Silhouette Ruins
    ctx.save();
    ctx.fillStyle = levelTheme.midgroundColor;
    this.drawMidground(ctx, this.offsetLayer2, gy - 25, 75);
    ctx.restore();

    // 5. Cinematic Speed Wind Streaks
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    for (const streak of this.windStreaks) {
      ctx.globalAlpha = streak.alpha;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(streak.x + streak.length, streak.y);
      ctx.stroke();
    }
    ctx.restore();

    // 6. Ambient Floating Energy Motes
    ctx.save();
    for (const mote of this.ambientMotes) {
      ctx.globalAlpha = mote.alpha;
      ctx.fillStyle = levelTheme.groundAccent;
      ctx.shadowColor = levelTheme.groundAccent;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 7. Running Terrain Platform
    ctx.save();
    // Solid Dark Ground Base
    const groundGrad = ctx.createLinearGradient(0, gy, 0, h);
    groundGrad.addColorStop(0, levelTheme.groundColor);
    groundGrad.addColorStop(1, '#05040a');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, gy, w, h - gy);

    // Glowing Neon Edge Line
    ctx.strokeStyle = levelTheme.groundAccent;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = levelTheme.groundAccent;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();

    // Rolling Ground Mist / Fog overlay
    const fogGrad = ctx.createLinearGradient(0, gy - 22, 0, gy + 8);
    fogGrad.addColorStop(0, 'transparent');
    fogGrad.addColorStop(0.6, levelTheme.moonGlow);
    fogGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fogGrad;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, gy - 22, w, 30);
    ctx.globalAlpha = 1.0;

    // Sci-fi Perspective Grid Lines on Ground
    ctx.strokeStyle = levelTheme.gridColor;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;

    // Moving vertical division hashmarks
    for (let x = -this.offsetGround; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x - 25, h);
      ctx.stroke();
    }

    // Horizontal speed depth lines
    [gy + 14, gy + 36, gy + 68].forEach((lineY) => {
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(w, lineY);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawSkyline(ctx, offset, baseY, height, alpha) {
    ctx.globalAlpha = alpha;
    const step = 90;
    const count = Math.ceil(this.width / step) + 3;

    ctx.beginPath();
    ctx.moveTo(-offset, this.height);
    for (let i = -1; i < count; i++) {
      const x = i * step - offset;
      const peakH = ((Math.sin(i * 1.8) + 1.2) / 2.2) * height;
      ctx.lineTo(x, baseY - peakH);
      ctx.lineTo(x + step * 0.5, baseY - peakH * 0.6);
      ctx.lineTo(x + step, baseY - peakH * 1.1);
    }
    ctx.lineTo(this.width + 100, this.height);
    ctx.closePath();
    ctx.fill();
  }

  drawMidground(ctx, offset, baseY, height) {
    ctx.globalAlpha = 0.85;
    const step = 65;
    const count = Math.ceil(this.width / step) + 3;

    ctx.beginPath();
    ctx.moveTo(-offset, this.height);
    for (let i = -1; i < count; i++) {
      const x = i * step - offset;
      const treeH = ((Math.sin(i * 3.1) + 1.2) / 2.2) * height + 25;
      ctx.lineTo(x, baseY);
      ctx.lineTo(x + step * 0.4, baseY - treeH);
      ctx.lineTo(x + step * 0.8, baseY);
    }
    ctx.lineTo(this.width + 100, this.height);
    ctx.closePath();
    ctx.fill();
  }
}
