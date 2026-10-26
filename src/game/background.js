// Ultra-Realistic Parallax Background: Volumetric Clouds, Photorealistic Moon,
// Procedural Foliage & Pine Trees, Shadow Cottages & Pagodas with Glowing Windows

export class ParallaxBackground {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.groundY = groundY;

    this.offsetLayer1 = 0; // Far mountains/skyline (factor 0.08)
    this.offsetLayer2 = 0; // Far trees & homes (factor 0.22)
    this.offsetLayer3 = 0; // Near midground trees & architecture (factor 0.45)
    this.offsetGround = 0; // Foreground terrain (factor 1.0)
    this.cloudOffsetHigh = 0;
    this.cloudOffsetLow = 0;

    // Realistic Deep Space Starfield
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (groundY * 0.72),
        size: Math.random() < 0.2 ? 2.2 : Math.random() < 0.5 ? 1.4 : 0.75,
        baseAlpha: 0.3 + Math.random() * 0.65,
        twinkleSpeed: 1.5 + Math.random() * 3,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // High-Altitude Cirrus Cloud Wisps
    this.cirrusClouds = [];
    for (let i = 0; i < 4; i++) {
      this.cirrusClouds.push({
        x: Math.random() * canvasWidth,
        y: 25 + Math.random() * 90,
        width: 200 + Math.random() * 260,
        height: 25 + Math.random() * 35,
        speed: 0.08 + Math.random() * 0.12,
        alpha: 0.12 + Math.random() * 0.15,
      });
    }

    // Volumetric Fluffy Billowing Clouds (Multi-Puff Clusters)
    this.volumetricClouds = [];
    for (let i = 0; i < 6; i++) {
      this.volumetricClouds.push({
        x: (canvasWidth / 6) * i + Math.random() * 100,
        y: 40 + Math.random() * 130,
        width: 160 + Math.random() * 140,
        height: 50 + Math.random() * 35,
        speed: 0.25 + Math.random() * 0.35,
        alpha: 0.25 + Math.random() * 0.25,
        // Deterministic cloud puff layout
        puffs: [
          { rx: -0.35, ry: 0.1, r: 0.3 },
          { rx: -0.15, ry: -0.15, r: 0.42 },
          { rx: 0.1, ry: -0.22, r: 0.48 },
          { rx: 0.32, ry: -0.05, r: 0.36 },
          { rx: 0.45, ry: 0.12, r: 0.26 },
        ]
      });
    }

    // Chimney Smoke Particles from Shadow Homes
    this.chimneySmoke = [];
    for (let i = 0; i < 20; i++) {
      this.chimneySmoke.push({
        x: Math.random() * canvasWidth,
        y: groundY - 50 - Math.random() * 60,
        vx: -0.6 - Math.random() * 0.8,
        vy: -0.8 - Math.random() * 0.6,
        size: 3 + Math.random() * 6,
        alpha: 0.15 + Math.random() * 0.25,
        life: Math.random() * 2.5,
        maxLife: 2.5,
      });
    }

    // Drifting Sakura / Autumn Night Leaves
    this.driftingLeaves = [];
    for (let i = 0; i < 18; i++) {
      this.driftingLeaves.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (groundY - 10),
        size: 2.5 + Math.random() * 3.5,
        speedX: 1.5 + Math.random() * 2.5,
        speedY: 0.5 + Math.random() * 1.0,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 4,
        alpha: 0.4 + Math.random() * 0.5,
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
    this.offsetLayer1 = (this.offsetLayer1 + gameSpeed * 0.1) % this.width;
    this.offsetLayer2 = (this.offsetLayer2 + gameSpeed * 0.25) % this.width;
    this.offsetLayer3 = (this.offsetLayer3 + gameSpeed * 0.48) % this.width;
    this.offsetGround = (this.offsetGround + gameSpeed) % 40;

    // Drifting cirrus & volumetric clouds
    for (const cloud of this.cirrusClouds) {
      cloud.x -= cloud.speed + gameSpeed * 0.05;
      if (cloud.x + cloud.width < -120) {
        cloud.x = this.width + 150;
        cloud.y = 20 + Math.random() * 100;
      }
    }

    for (const cloud of this.volumetricClouds) {
      cloud.x -= cloud.speed + gameSpeed * 0.12;
      if (cloud.x + cloud.width < -150) {
        cloud.x = this.width + 160;
        cloud.y = 35 + Math.random() * 140;
      }
    }

    // Chimney smoke simulation
    for (const smoke of this.chimneySmoke) {
      smoke.x += smoke.vx - gameSpeed * 0.35;
      smoke.y += smoke.vy;
      smoke.size += dt * 3.5;
      smoke.alpha -= dt * 0.1;
      smoke.life -= dt;
      if (smoke.life <= 0 || smoke.alpha <= 0) {
        smoke.x = Math.random() * this.width;
        smoke.y = this.groundY - 55;
        smoke.size = 3;
        smoke.alpha = 0.28;
        smoke.life = 2.2;
      }
    }

    // Drifting leaves
    for (const leaf of this.driftingLeaves) {
      leaf.x -= leaf.speedX + gameSpeed * 0.6;
      leaf.y += Math.sin(Date.now() / 350 + leaf.rot) * 0.8 + leaf.speedY;
      leaf.rot += leaf.rotSpeed * dt;

      if (leaf.x < -20 || leaf.y > this.groundY + 10) {
        leaf.x = this.width + 20;
        leaf.y = Math.random() * (this.groundY - 60);
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

    // 3. High-Altitude Cirrus Clouds (Behind Moon)
    this.drawCirrusClouds(ctx);

    // 4. Photorealistic Celestial Moon with Lunar Maria & 3D Shading
    this.drawRealisticMoon(ctx, w, h, gy, levelTheme);

    // 5. Volumetric Fluffy Night Clouds (Passing In Front of Sky & Moon)
    this.drawVolumetricClouds(ctx, levelTheme);

    // 6. Layer 1: Distant Jagged Mountains / Cyber Skyline
    ctx.save();
    ctx.fillStyle = levelTheme.mountainColor;
    this.drawSkyline(ctx, this.offsetLayer1, gy - 75, 115, 0.42);
    ctx.restore();

    // 7. Layer 2: Deep Far Silhouette Forest (Factor 0.25)
    this.drawFarForest(ctx, this.offsetLayer2, gy - 20, levelTheme.mountainColor);

    // 8. Layer 3: Realistic Midground with Trees, Foliage, Cottages & Pagodas (Factor 0.48)
    this.drawHomesAndTrees(ctx, this.offsetLayer3, gy, levelTheme);

    // 9. Chimney Smoke Wisps
    ctx.save();
    for (const smoke of this.chimneySmoke) {
      ctx.globalAlpha = Math.max(0, smoke.alpha);
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 10. Drifting Sakura / Autumn Leaves
    ctx.save();
    for (const leaf of this.driftingLeaves) {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rot);
      ctx.globalAlpha = leaf.alpha;
      ctx.fillStyle = levelTheme.groundAccent;
      ctx.shadowColor = levelTheme.groundAccent;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.size * 1.4, leaf.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 11. Cinematic Speed Wind Streaks
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

    // 12. Running Terrain Platform & Swaying Foreground Foliage
    this.drawTerrainAndFoliage(ctx, w, h, gy, levelTheme);
  }

  // Draw High-Altitude Wispy Cirrus Clouds
  drawCirrusClouds(ctx) {
    ctx.save();
    for (const c of this.cirrusClouds) {
      const grad = ctx.createLinearGradient(c.x, c.y, c.x + c.width, c.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.3, `rgba(168, 175, 215, ${c.alpha})`);
      grad.addColorStop(0.7, `rgba(190, 200, 235, ${c.alpha * 1.2})`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(c.x + c.width * 0.5, c.y + c.height * 0.5, c.width * 0.5, c.height * 0.5, -0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Volumetric Fluffy Multi-Puff Clouds with Silver Moonlight Rim
  drawVolumetricClouds(ctx, levelTheme) {
    ctx.save();
    for (const cloud of this.volumetricClouds) {
      const cx = cloud.x + cloud.width * 0.5;
      const cy = cloud.y + cloud.height * 0.5;

      // Dark shaded underside
      ctx.fillStyle = 'rgba(15, 12, 28, 0.62)';
      ctx.beginPath();
      for (const puff of cloud.puffs) {
        const px = cx + puff.rx * cloud.width;
        const py = cy + puff.ry * cloud.height + 4;
        const pr = puff.r * cloud.height * 1.1;
        ctx.arc(px, py, pr, 0, Math.PI * 2);
      }
      ctx.fill();

      // Soft volumetric mid-body
      const bodyGrad = ctx.createRadialGradient(cx, cy - 8, cloud.height * 0.3, cx, cy, cloud.width * 0.55);
      bodyGrad.addColorStop(0, `rgba(60, 55, 90, ${cloud.alpha * 1.1})`);
      bodyGrad.addColorStop(0.7, `rgba(28, 22, 48, ${cloud.alpha})`);
      bodyGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      for (const puff of cloud.puffs) {
        const px = cx + puff.rx * cloud.width;
        const py = cy + puff.ry * cloud.height;
        const pr = puff.r * cloud.height;
        ctx.arc(px, py, pr, 0, Math.PI * 2);
      }
      ctx.fill();

      // Silver Moonlight Rim Highlight on Cloud Top Crests
      ctx.strokeStyle = `rgba(240, 245, 255, ${cloud.alpha * 0.75})`;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = levelTheme.moonColor;
      ctx.shadowBlur = 8;
      for (const puff of cloud.puffs) {
        const px = cx + puff.rx * cloud.width;
        const py = cy + puff.ry * cloud.height;
        const pr = puff.r * cloud.height;
        ctx.beginPath();
        // Top semi-circle crest
        ctx.arc(px, py, pr, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Draw Photorealistic 3D Moon
  drawRealisticMoon(ctx, w, h, gy, levelTheme) {
    const moonX = Math.min(w * 0.78, w - 85);
    const moonY = Math.max(70, Math.min(h * 0.22, 160));
    const moonRadius = Math.max(38, Math.min(68, Math.floor(w * 0.11)));

    ctx.save();

    // Multi-tiered Atmospheric Glow Halos
    const outerHalo = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.4);
    outerHalo.addColorStop(0, levelTheme.moonGlow);
    outerHalo.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
    outerHalo.addColorStop(1, 'transparent');
    ctx.fillStyle = outerHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3.4, 0, Math.PI * 2);
    ctx.fill();

    const innerCorona = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.7, moonX, moonY, moonRadius * 1.35);
    innerCorona.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    innerCorona.addColorStop(0.7, levelTheme.moonGlow);
    innerCorona.addColorStop(1, 'transparent');
    ctx.fillStyle = innerCorona;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Volumetric Light Cone
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

    // Clip to spherical moon disc
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // Base Spherical Lunar Gradient
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
    sphereGrad.addColorStop(1.0, '#475569');
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2);

    // Lunar Maria (Dark Basaltic Volcanic Plains)
    ctx.fillStyle = 'rgba(30, 27, 46, 0.38)';
    ctx.beginPath();
    ctx.ellipse(moonX - moonRadius * 0.28, moonY - moonRadius * 0.18, moonRadius * 0.42, moonRadius * 0.32, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.22, moonY - moonRadius * 0.1, moonRadius * 0.32, moonRadius * 0.26, 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(25, 20, 40, 0.45)';
    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.52, moonY - moonRadius * 0.15, moonRadius * 0.16, moonRadius * 0.13, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Tycho Crater & Rays
    const tychoX = moonX + moonRadius * 0.05;
    const tychoY = moonY + moonRadius * 0.54;
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
    ctx.fillStyle = 'rgba(20, 15, 30, 0.7)';
    ctx.beginPath();
    ctx.arc(tychoX, tychoY, moonRadius * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Craters with Specular Sunlight Highlights
    const craters = [
      { x: moonX - moonRadius * 0.42, y: moonY - moonRadius * 0.32, r: moonRadius * 0.09 },
      { x: moonX - moonRadius * 0.08, y: moonY - moonRadius * 0.45, r: moonRadius * 0.075 },
      { x: moonX + moonRadius * 0.34, y: moonY + moonRadius * 0.22, r: moonRadius * 0.08 },
    ];
    for (const c of craters) {
      ctx.fillStyle = 'rgba(15, 12, 25, 0.65)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(c.x - 0.8, c.y - 0.8, c.r * 0.85, Math.PI * 0.75, Math.PI * 1.75);
      ctx.stroke();
    }

    // Limb Darkening
    const limbGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.82, moonX, moonY, moonRadius);
    limbGrad.addColorStop(0, 'transparent');
    limbGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.2)');
    limbGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = limbGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // End clip

    // Sunlit Rim Crescent
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, Math.PI * 0.85, Math.PI * 1.65);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Distant Skyline (Far Mountains & Towers)
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

  // Draw Deep Far Forest Silhouettes
  drawFarForest(ctx, offset, baseY, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.55;
    const step = 45;
    const count = Math.ceil(this.width / step) + 3;

    ctx.beginPath();
    ctx.moveTo(-offset, this.height);
    for (let i = -1; i < count; i++) {
      const x = i * step - offset;
      const treeH = 35 + ((Math.sin(i * 2.7) + 1) / 2) * 45;
      ctx.lineTo(x, baseY);
      ctx.lineTo(x + step * 0.5, baseY - treeH);
      ctx.lineTo(x + step, baseY);
    }
    ctx.lineTo(this.width + 100, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw Realistic Foliage Trees & Shadow Homes (Cottages, Pagodas, Shinto Torii)
  drawHomesAndTrees(ctx, offset, groundY, levelTheme) {
    const spacing = 320; // Repetition spacing
    const count = Math.ceil(this.width / spacing) + 3;

    for (let i = -1; i < count; i++) {
      const baseX = i * spacing - offset;

      // 1. Shadow Home: Traditional Cottage with Glowing Lantern Window & Chimney
      if (i % 2 === 0) {
        this.drawCottage(ctx, baseX + 40, groundY, levelTheme);
      } else {
        // 2. Multi-tiered Pagoda / Shrine Torii
        this.drawPagoda(ctx, baseX + 60, groundY, levelTheme);
      }

      // 3. Realistic Anatomical Pine / Bonsai Shadow Trees
      this.drawRealisticPineTree(ctx, baseX + 190, groundY, 75, levelTheme);
      this.drawBroadleafTree(ctx, baseX + 280, groundY, 65, levelTheme);
    }
  }

  // Draw Cozy Shadow Cottage with Pitch Roof, Chimney & Glowing Amber Windows
  drawCottage(ctx, x, groundY, levelTheme) {
    ctx.save();
    const w = 55;
    const h = 42;
    const y = groundY - h;

    // Cottage Walls
    ctx.fillStyle = '#0e0b1c';
    ctx.fillRect(x, y + 14, w, h - 14);

    // Wall Trim & Timber Frames
    ctx.strokeStyle = '#1d1734';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y + 14, w, h - 14);

    // Traditional Curved Overhanging Eaves Roof
    ctx.fillStyle = '#090714';
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 16);
    ctx.quadraticCurveTo(x + w * 0.5, y - 4, x + w + 10, y + 16);
    ctx.lineTo(x + w + 4, y + 10);
    ctx.quadraticCurveTo(x + w * 0.5, y - 8, x - 4, y + 10);
    ctx.closePath();
    ctx.fill();

    // Chimney with Top Rim
    ctx.fillStyle = '#141026';
    ctx.fillRect(x + w - 14, y - 2, 7, 16);
    ctx.fillRect(x + w - 16, y - 4, 11, 3);

    // Warm Glowing Amber Shoji Window (House Interior Light)
    ctx.save();
    const winX = x + 12;
    const winY = y + 20;
    const winW = 18;
    const winH = 14;

    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.fillRect(winX, winY, winW, winH);

    // Window Lattice Cross
    ctx.strokeStyle = '#3b2310';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(winX + winW * 0.5, winY);
    ctx.lineTo(winX + winW * 0.5, winY + winH);
    ctx.moveTo(winX, winY + winH * 0.5);
    ctx.lineTo(winX + winW, winY + winH * 0.5);
    ctx.stroke();
    ctx.restore();

    // Red Front Lantern near Door
    ctx.save();
    const lanternX = x + 38;
    const lanternY = y + 22;
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Draw Multi-Tiered Pagoda Tower
  drawPagoda(ctx, x, groundY, levelTheme) {
    ctx.save();
    const baseY = groundY;

    // Tower Pillars
    ctx.fillStyle = '#0b0817';
    ctx.fillRect(x + 12, baseY - 65, 24, 65);

    // Tier 1 Roof
    ctx.fillStyle = '#070510';
    ctx.beginPath();
    ctx.moveTo(x, baseY - 24);
    ctx.quadraticCurveTo(x + 24, baseY - 32, x + 48, baseY - 24);
    ctx.lineTo(x + 44, baseY - 28);
    ctx.quadraticCurveTo(x + 24, baseY - 36, x + 4, baseY - 28);
    ctx.closePath();
    ctx.fill();

    // Tier 2 Roof
    ctx.beginPath();
    ctx.moveTo(x + 4, baseY - 46);
    ctx.quadraticCurveTo(x + 24, baseY - 54, x + 44, baseY - 46);
    ctx.lineTo(x + 40, baseY - 50);
    ctx.quadraticCurveTo(x + 24, baseY - 58, x + 8, baseY - 50);
    ctx.closePath();
    ctx.fill();

    // Tier 3 Spire Roof
    ctx.beginPath();
    ctx.moveTo(x + 8, baseY - 66);
    ctx.quadraticCurveTo(x + 24, baseY - 74, x + 40, baseY - 66);
    ctx.lineTo(x + 24, baseY - 84); // Pinnacle finial
    ctx.closePath();
    ctx.fill();

    // Glowing Pagoda Window
    ctx.save();
    ctx.fillStyle = '#00f5ff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 12;
    ctx.fillRect(x + 20, baseY - 42, 8, 8);
    ctx.restore();

    ctx.restore();
  }

  // Draw Realistic Japanese Shadow Pine (Layered Niwaki Needle Pads)
  drawRealisticPineTree(ctx, x, groundY, height, levelTheme) {
    ctx.save();
    const trunkW = 6;
    const baseY = groundY;

    // Tapering Curved Trunk
    ctx.fillStyle = '#080612';
    ctx.beginPath();
    ctx.moveTo(x - trunkW, baseY);
    ctx.quadraticCurveTo(x - 2, baseY - height * 0.5, x + 4, baseY - height);
    ctx.lineTo(x + 8, baseY - height);
    ctx.quadraticCurveTo(x + 4, baseY - height * 0.5, x + trunkW, baseY);
    ctx.closePath();
    ctx.fill();

    // Branches & Layered Foliage Needle Pads
    const pads = [
      { rx: -16, ry: -height * 0.45, w: 28, h: 10 },
      { rx: 14, ry: -height * 0.62, w: 32, h: 11 },
      { rx: -12, ry: -height * 0.78, w: 26, h: 9 },
      { rx: 4, ry: -height * 0.98, w: 22, h: 8 },
    ];

    ctx.fillStyle = '#0d0a1d';
    ctx.strokeStyle = levelTheme.groundAccent;
    ctx.lineWidth = 1;

    for (const pad of pads) {
      const px = x + pad.rx;
      const py = baseY + pad.ry;

      // Draw horizontal cloud-like foliage pad
      ctx.beginPath();
      ctx.ellipse(px, py, pad.w, pad.h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Delicate serrated pine needle rim on top
      ctx.beginPath();
      for (let nx = px - pad.w * 0.8; nx <= px + pad.w * 0.8; nx += 4) {
        ctx.moveTo(nx, py - pad.h * 0.6);
        ctx.lineTo(nx + 1.5, py - pad.h * 0.9);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Broadleaf Shadow Tree with Organic Billowing Leaf Clumps
  drawBroadleafTree(ctx, x, groundY, height, levelTheme) {
    ctx.save();
    const baseY = groundY;

    // Trunk
    ctx.fillStyle = '#090714';
    ctx.beginPath();
    ctx.moveTo(x - 5, baseY);
    ctx.lineTo(x - 2, baseY - height * 0.6);
    ctx.lineTo(x + 2, baseY - height * 0.6);
    ctx.lineTo(x + 5, baseY);
    ctx.closePath();
    ctx.fill();

    // Organic Leaf Canopy Clumps
    ctx.fillStyle = '#0f0c22';
    const clumps = [
      { ox: 0, oy: -height * 0.75, r: 22 },
      { ox: -14, oy: -height * 0.65, r: 16 },
      { ox: 14, oy: -height * 0.62, r: 17 },
      { ox: -6, oy: -height * 0.88, r: 15 },
      { ox: 8, oy: -height * 0.85, r: 14 },
    ];

    for (const c of clumps) {
      ctx.beginPath();
      ctx.arc(x + c.ox, baseY + c.oy, c.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Specular Rim Light on Canopy Top
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, baseY - height * 0.82, 20, Math.PI * 1.1, Math.PI * 1.85);
    ctx.stroke();

    ctx.restore();
  }

  // Draw Ground Platform with Swaying Foreground Grass Blades & Wildflowers
  drawTerrainAndFoliage(ctx, w, h, gy, levelTheme) {
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

    // Horizontal depth lines
    [gy + 14, gy + 36, gy + 68].forEach((lineY) => {
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(w, lineY);
      ctx.stroke();
    });

    // Realistic Swaying Grass Blades & Reeds Along the Ground Line
    const time = Date.now() / 400;
    ctx.strokeStyle = '#18122c';
    ctx.lineWidth = 1.8;
    for (let gx = 0; gx < w; gx += 16) {
      const sway = Math.sin(time + gx * 0.1) * 4;
      const bladeH = 6 + Math.abs(Math.sin(gx * 0.2)) * 8;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx + sway * 0.5, gy - bladeH * 0.6, gx + sway, gy - bladeH);
      ctx.stroke();
    }

    ctx.restore();
  }
}
