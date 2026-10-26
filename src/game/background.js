// Parallax Background, Photorealistic Moon, Atmospheric Cloud Wisps, and Terrain

export class ParallaxBackground {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.groundY = groundY;

    this.offsetLayer1 = 0; // Far mountains/skyline (factor 0.1)
    this.offsetLayer2 = 0; // Midground trees/ruins (factor 0.35)
    this.offsetGround = 0; // Foreground terrain (factor 1.0)
    this.fogOffset = 0;
    this.cloudOffset = 0; // Drifting nocturnal clouds across moon

    // Realistic Deep Space Starfield
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (groundY * 0.75),
        size: Math.random() < 0.2 ? 2.2 : Math.random() < 0.5 ? 1.5 : 0.8,
        baseAlpha: 0.3 + Math.random() * 0.65,
        twinkleSpeed: 1.5 + Math.random() * 3,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Wispy Nocturnal Clouds Passing Over the Moon
    this.nightClouds = [];
    for (let i = 0; i < 5; i++) {
      this.nightClouds.push({
        x: Math.random() * canvasWidth,
        y: 40 + Math.random() * 140,
        width: 140 + Math.random() * 180,
        height: 22 + Math.random() * 28,
        speed: 0.15 + Math.random() * 0.25,
        alpha: 0.18 + Math.random() * 0.22,
      });
    }

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
    for (let i = 0; i < 18; i++) {
      this.windStreaks.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * groundY,
        length: 25 + Math.random() * 55,
        speed: 12 + Math.random() * 20,
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
    this.cloudOffset = (this.cloudOffset + dt * 15 + gameSpeed * 0.08) % (this.width + 300);

    // Drifting night clouds
    for (const cloud of this.nightClouds) {
      cloud.x -= cloud.speed + gameSpeed * 0.04;
      if (cloud.x + cloud.width < -100) {
        cloud.x = this.width + 120;
        cloud.y = 35 + Math.random() * 150;
      }
    }

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

    // 1. Deep Space Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, gy);
    skyGrad.addColorStop(0, levelTheme.skyGradient[0]);
    skyGrad.addColorStop(0.5, levelTheme.skyGradient[1]);
    skyGrad.addColorStop(1, levelTheme.skyGradient[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Realistic Twinkling Starfield
    const now = Date.now() / 1000;
    ctx.save();
    for (const star of this.stars) {
      const twinkle = Math.sin(now * star.twinkleSpeed + star.twinkleOffset);
      const alpha = Math.max(0.1, Math.min(1.0, star.baseAlpha + twinkle * 0.3));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = star.size > 1.8 ? 5 : 0;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Photorealistic Celestial Moon with Lunar Maria & 3D Shading
    this.drawRealisticMoon(ctx, w, h, gy, levelTheme);

    // 4. Wispy Nocturnal Clouds Passing Over the Moon Face
    ctx.save();
    for (const cloud of this.nightClouds) {
      const grad = ctx.createRadialGradient(
        cloud.x + cloud.width * 0.5,
        cloud.y + cloud.height * 0.5,
        4,
        cloud.x + cloud.width * 0.5,
        cloud.y + cloud.height * 0.5,
        cloud.width * 0.5
      );
      grad.addColorStop(0, `rgba(180, 195, 230, ${cloud.alpha})`);
      grad.addColorStop(0.6, `rgba(100, 120, 160, ${cloud.alpha * 0.5})`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(
        cloud.x + cloud.width * 0.5,
        cloud.y + cloud.height * 0.5,
        cloud.width * 0.5,
        cloud.height * 0.5,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();

    // 5. Layer 1: Distant Jagged Mountains / Cyber Skyline
    ctx.save();
    ctx.fillStyle = levelTheme.mountainColor;
    this.drawSkyline(ctx, this.offsetLayer1, gy - 70, 110, 0.4);
    ctx.restore();

    // 6. Layer 2: Midground Gothic Pines / Silhouette Ruins
    ctx.save();
    ctx.fillStyle = levelTheme.midgroundColor;
    this.drawMidground(ctx, this.offsetLayer2, gy - 25, 75);
    ctx.restore();

    // 7. Cinematic Speed Wind Streaks
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    for (const streak of this.windStreaks) {
      ctx.globalAlpha = streak.alpha;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(streak.x + streak.length, streak.y);
      ctx.stroke();
    }
    ctx.restore();

    // 8. Ambient Floating Energy Motes
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

    // 9. Running Terrain Platform & Neon Grid
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

  // Draw Highly Detailed, Photorealistic 3D Moon with Basaltic Seas (Maria) & Impact Rays
  drawRealisticMoon(ctx, w, h, gy, levelTheme) {
    // Position adapted for mobile & desktop
    const moonX = Math.min(w * 0.78, w - 85);
    const moonY = Math.max(70, Math.min(h * 0.22, 160));
    const moonRadius = Math.max(38, Math.min(68, Math.floor(w * 0.11)));

    ctx.save();

    // A. Multi-tiered Atmospheric Glow Halos
    // Outer diffuse cosmic haze
    const outerHalo = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.4);
    outerHalo.addColorStop(0, levelTheme.moonGlow);
    outerHalo.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
    outerHalo.addColorStop(1, 'transparent');
    ctx.fillStyle = outerHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3.4, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright corona
    const innerCorona = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.7, moonX, moonY, moonRadius * 1.35);
    innerCorona.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    innerCorona.addColorStop(0.7, levelTheme.moonGlow);
    innerCorona.addColorStop(1, 'transparent');
    ctx.fillStyle = innerCorona;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Volumetric Light Cone streaming to ground
    const rayGrad = ctx.createLinearGradient(moonX, moonY, moonX - 120, gy);
    rayGrad.addColorStop(0, levelTheme.moonGlow);
    rayGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(moonX - moonRadius * 0.65, moonY);
    ctx.lineTo(moonX - 260, gy);
    ctx.lineTo(moonX + 110, gy);
    ctx.lineTo(moonX + moonRadius * 0.65, moonY);
    ctx.closePath();
    ctx.fill();

    // Clip to spherical moon disc for surface features
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // B. Base Spherical Lunar Gradient (3D light source from top-left)
    const sphereGrad = ctx.createRadialGradient(
      moonX - moonRadius * 0.28,
      moonY - moonRadius * 0.28,
      moonRadius * 0.1,
      moonX + moonRadius * 0.15,
      moonY + moonRadius * 0.15,
      moonRadius * 1.05
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.35, levelTheme.moonColor);
    sphereGrad.addColorStop(0.75, '#c4b5fd');
    sphereGrad.addColorStop(1.0, '#475569'); // Dark terminator shadow
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2);

    // C. Lunar Maria (Dark Basaltic Volcanic Plains)
    ctx.fillStyle = 'rgba(30, 27, 46, 0.38)';
    
    // Oceanus Procellarum & Mare Imbrium (Top-Left Large Basin)
    ctx.beginPath();
    ctx.ellipse(moonX - moonRadius * 0.28, moonY - moonRadius * 0.18, moonRadius * 0.42, moonRadius * 0.32, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mare Serenitatis & Tranquillitatis (Center-Right Seas)
    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.22, moonY - moonRadius * 0.1, moonRadius * 0.32, moonRadius * 0.26, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Mare Crisium (Crisp isolated oval on eastern edge)
    ctx.fillStyle = 'rgba(25, 20, 40, 0.45)';
    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.52, moonY - moonRadius * 0.15, moonRadius * 0.16, moonRadius * 0.13, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Mare Nubium & Humorum (Southern Basins)
    ctx.fillStyle = 'rgba(30, 25, 45, 0.36)';
    ctx.beginPath();
    ctx.ellipse(moonX - moonRadius * 0.15, moonY + moonRadius * 0.32, moonRadius * 0.3, moonRadius * 0.24, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // D. Tycho Impact Crater & Filament Ray System (Southern Rim)
    const tychoX = moonX + moonRadius * 0.05;
    const tychoY = moonY + moonRadius * 0.54;

    // Tycho bright ejecta filaments radiating outward across the southern hemisphere
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    const rayAngles = [-2.4, -2.1, -1.8, -1.5, -1.2, -0.8, -0.4, 0.1, 0.6];
    for (const angle of rayAngles) {
      const rayLen = moonRadius * (0.6 + Math.sin(angle * 4) * 0.25);
      ctx.beginPath();
      ctx.moveTo(tychoX, tychoY);
      ctx.lineTo(tychoX + Math.cos(angle) * rayLen, tychoY + Math.sin(angle) * rayLen);
      ctx.stroke();
    }

    // Tycho central peak crater
    ctx.fillStyle = 'rgba(20, 15, 30, 0.7)';
    ctx.beginPath();
    ctx.arc(tychoX, tychoY, moonRadius * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tychoX - 1, tychoY - 1, moonRadius * 0.035, 0, Math.PI * 2);
    ctx.fill();

    // E. Realistic Craters with Specular Sunlight Highlights & Shadows
    const craters = [
      { x: moonX - moonRadius * 0.42, y: moonY - moonRadius * 0.32, r: moonRadius * 0.09 }, // Copernicus
      { x: moonX - moonRadius * 0.08, y: moonY - moonRadius * 0.45, r: moonRadius * 0.075 }, // Plato
      { x: moonX + moonRadius * 0.34, y: moonY + moonRadius * 0.22, r: moonRadius * 0.08 },
      { x: moonX - moonRadius * 0.48, y: moonY + moonRadius * 0.15, r: moonRadius * 0.065 },
      { x: moonX + moonRadius * 0.12, y: moonY - moonRadius * 0.38, r: moonRadius * 0.06 },
    ];

    for (const c of craters) {
      // Dark shadow crescent on down-right
      ctx.fillStyle = 'rgba(15, 12, 25, 0.65)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Bright sunlit rim on top-left
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(c.x - 0.8, c.y - 0.8, c.r * 0.85, Math.PI * 0.75, Math.PI * 1.75);
      ctx.stroke();

      // Central crater rebound peak
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // F. Spherical Limb Darkening Ring (Atmospheric falloff at perimeter)
    const limbGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.82, moonX, moonY, moonRadius);
    limbGrad.addColorStop(0, 'transparent');
    limbGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.2)');
    limbGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = limbGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // End clip

    // G. Ultra-thin Specular Sunlit Rim Crescent on Edge
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, Math.PI * 0.85, Math.PI * 1.65);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // End moon transform
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
