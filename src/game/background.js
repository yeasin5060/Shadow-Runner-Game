// Photorealistic Background Engine: Realistic Stratified Terrain, Volumetric Moonlight Clouds,
// Masterpiece 3D Moon with Craters & Maria, Bioluminescent Fireflies (জোনাকি পোকা), and Shadow Architecture

export class ParallaxBackground {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.groundY = groundY;

    this.offsetLayer1 = 0; // Far mountains/skyline (factor 0.08)
    this.offsetLayer2 = 0; // Far trees & homes (factor 0.22)
    this.offsetLayer3 = 0; // Midground trees & architecture (factor 0.45)
    this.offsetGround = 0; // Foreground terrain (factor 1.0)
    this.fogOffset = 0;

    // 1. Realistic Deep Space Starfield
    this.stars = [];
    for (let i = 0; i < 85; i++) {
      this.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (groundY * 0.72),
        size: Math.random() < 0.15 ? 2.3 : Math.random() < 0.5 ? 1.4 : 0.8,
        baseAlpha: 0.3 + Math.random() * 0.65,
        twinkleSpeed: 1.5 + Math.random() * 3,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. High-Altitude Cirrus & Volumetric Clouds with Responsive Positioning
    this.initClouds(canvasWidth, canvasHeight, groundY);

    // 4. Delicate Bioluminescent Fireflies (আসল জোনাকি পোকা - কোনো বাবল বা বৃত্ত নয়)
    this.fireflies = [];
    for (let i = 0; i < 36; i++) {
      this.fireflies.push({
        x: Math.random() * canvasWidth,
        y: 60 + Math.random() * (groundY - 70),
        size: 1.2 + Math.random() * 1.5,
        driftX: 0.2 + Math.random() * 0.45,
        hoverFreq: 1.2 + Math.random() * 2.5,
        hoverAmp: 0.6 + Math.random() * 1.2,
        hoverOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 2.0 + Math.random() * 3.0,
        pulseOffset: Math.random() * Math.PI * 2,
        wingFreq: 22 + Math.random() * 12,
        maxAlpha: 0.6 + Math.random() * 0.4,
        colorType: Math.random() < 0.7 ? 'lime' : 'gold',
      });
    }

    // 5. Terrain Geological Stratification Pebbles & Flagstones
    this.groundPebbles = [];
    for (let i = 0; i < 35; i++) {
      this.groundPebbles.push({
        relX: Math.random() * 600,
        depth: 8 + Math.random() * 70,
        width: 6 + Math.random() * 16,
        height: 3 + Math.random() * 7,
        shade: Math.random() < 0.5 ? '#151128' : '#0d0a1b',
      });
    }
  }

  initClouds(w, h, groundY) {
    const isMobile = w < 768 || h < 520;
    const skyLimit = Math.min(isMobile ? 55 : 120, groundY * (isMobile ? 0.22 : 0.35));

    // Cirrus clouds (spaced out, upper atmosphere)
    const cirrusCount = isMobile ? 2 : 4;
    this.cirrusClouds = [];
    const cirrusSpacing = w / cirrusCount;
    for (let i = 0; i < cirrusCount; i++) {
      this.cirrusClouds.push({
        x: cirrusSpacing * i + Math.random() * (cirrusSpacing * 0.4),
        y: 8 + Math.random() * (skyLimit * 0.6),
        width: isMobile ? 110 + Math.random() * 70 : 190 + Math.random() * 220,
        height: isMobile ? 16 + Math.random() * 12 : 25 + Math.random() * 32,
        speed: 0.08 + Math.random() * 0.1,
        alpha: isMobile ? 0.12 + Math.random() * 0.1 : 0.14 + Math.random() * 0.16,
      });
    }

    // Volumetric Billowing Clouds - Spaced apart with generous gaps, never clumped
    const volCount = isMobile ? 3 : 5;
    this.volumetricClouds = [];
    const volSpacing = w / volCount;
    for (let i = 0; i < volCount; i++) {
      this.volumetricClouds.push({
        x: volSpacing * i + (Math.random() * 30 - 15),
        y: 12 + Math.random() * skyLimit,
        width: isMobile ? 120 + Math.random() * 60 : 180 + Math.random() * 130,
        height: isMobile ? 30 + Math.random() * 14 : 50 + Math.random() * 34,
        speed: 0.16 + Math.random() * 0.2,
        alpha: isMobile ? 0.22 + Math.random() * 0.16 : 0.28 + Math.random() * 0.22,
        puffs: [
          { rx: -0.38, ry: 0.12, r: 0.32 },
          { rx: -0.18, ry: -0.18, r: 0.44 },
          { rx: 0.08, ry: -0.25, r: 0.52 },
          { rx: 0.32, ry: -0.06, r: 0.38 },
          { rx: 0.46, ry: 0.14, r: 0.28 },
          { rx: -0.02, ry: 0.18, r: 0.34 },
        ]
      });
    }
  }

  resize(w, h, groundY) {
    this.width = w;
    this.height = h;
    this.groundY = groundY;

    // Rescale stars into new viewport bounds
    for (const star of this.stars) {
      if (star.x > w) star.x = Math.random() * w;
      if (star.y > groundY * 0.72) star.y = Math.random() * (groundY * 0.72);
    }

    // Rebalance and clamp clouds cleanly
    const isMobile = w < 768 || h < 520;
    const skyLimit = Math.min(isMobile ? 55 : 120, groundY * (isMobile ? 0.22 : 0.35));

    const volCount = isMobile ? 3 : 5;
    if (this.volumetricClouds.length > volCount) {
      this.volumetricClouds = this.volumetricClouds.slice(0, volCount);
    } else if (this.volumetricClouds.length < volCount) {
      this.initClouds(w, h, groundY);
      return;
    }

    const volSpacing = w / Math.max(1, this.volumetricClouds.length);
    this.volumetricClouds.forEach((cloud, i) => {
      cloud.y = Math.min(cloud.y, skyLimit);
      cloud.width = isMobile ? Math.min(cloud.width, 180) : cloud.width;
      cloud.height = isMobile ? Math.min(cloud.height, 42) : cloud.height;
      if (cloud.x > w + 160) {
        cloud.x = volSpacing * i;
      }
    });

    const cirrusCount = isMobile ? 2 : 4;
    if (this.cirrusClouds.length > cirrusCount) {
      this.cirrusClouds = this.cirrusClouds.slice(0, cirrusCount);
    }
    this.cirrusClouds.forEach((cloud) => {
      cloud.y = Math.min(cloud.y, skyLimit * 0.65);
      if (isMobile && cloud.width > 180) cloud.width = 140;
      if (isMobile && cloud.height > 24) cloud.height = 18;
      if (cloud.x > w + 140) cloud.x = Math.random() * w;
    });

    // Fireflies within bounds
    for (const f of this.fireflies) {
      if (f.x > w) f.x = Math.random() * w;
      if (f.y > groundY - 40) f.y = 50 + Math.random() * Math.max(30, groundY - 80);
    }
  }

  update(gameSpeed, dt) {
    this.offsetLayer1 = (this.offsetLayer1 + gameSpeed * 0.1) % this.width;
    this.offsetLayer2 = (this.offsetLayer2 + gameSpeed * 0.24) % this.width;
    this.offsetLayer3 = (this.offsetLayer3 + gameSpeed * 0.48) % this.width;
    this.offsetGround = (this.offsetGround + gameSpeed) % 600; // pebble loop
    this.fogOffset = (this.fogOffset + gameSpeed * 0.7) % this.width;

    const isMobile = this.width < 768 || this.height < 520;
    const skyLimit = Math.min(isMobile ? 55 : 120, this.groundY * (isMobile ? 0.22 : 0.35));

    // Drifting clouds with generous wrap-around spacing
    for (const cloud of this.cirrusClouds) {
      cloud.x -= cloud.speed + gameSpeed * 0.05;
      if (cloud.x + cloud.width < -120) {
        cloud.x = this.width + 100 + Math.random() * 100;
        cloud.y = 8 + Math.random() * (skyLimit * 0.6);
      }
    }

    for (const cloud of this.volumetricClouds) {
      cloud.x -= cloud.speed + gameSpeed * 0.12;
      if (cloud.x + cloud.width < -140) {
        cloud.x = this.width + 120 + Math.random() * 120;
        cloud.y = 12 + Math.random() * skyLimit;
      }
    }

    // Update Fireflies (জোনাকি পোকা) with organic sinusoidal flight
    const now = Date.now() / 1000;
    for (const f of this.fireflies) {
      f.x -= f.driftX + gameSpeed * 0.15;
      f.y += Math.sin(now * f.hoverFreq + f.hoverOffset) * 0.5;

      if (f.x < -15) {
        f.x = this.width + 15 + Math.random() * 40;
        f.y = 50 + Math.random() * (this.groundY - 60);
      }
    }
  }

  draw(ctx, levelTheme) {
    const w = this.width;
    const h = this.height;
    const gy = this.groundY;

    // 1. Deep Celestial Twilight & Cosmic Atmosphere
    const skyGrad = ctx.createLinearGradient(0, 0, 0, gy);
    skyGrad.addColorStop(0, '#020108'); // Zenith Deep Space Abyss
    skyGrad.addColorStop(0.28, levelTheme.skyGradient[0]);
    skyGrad.addColorStop(0.62, levelTheme.skyGradient[1]);
    skyGrad.addColorStop(0.88, levelTheme.skyGradient[2]);
    skyGrad.addColorStop(1.0, '#221538'); // Atmospheric Airglow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 1.5. Deep Space Cosmic Nebula Dust Lanes (গ্যালাকটিক নেবুলা গ্যাস মেঘ)
    this.drawCosmicNebula(ctx, w, gy);

    // 2. Realistic Twinkling Deep Space Starfield with Stellar Diffraction Spikes
    const now = Date.now() / 1000;
    ctx.save();
    for (const star of this.stars) {
      const twinkle = Math.sin(now * star.twinkleSpeed + star.twinkleOffset);
      const alpha = Math.max(0.12, Math.min(1.0, star.baseAlpha + twinkle * 0.35));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';

      if (star.size > 1.8) {
        // Bright Diamond Star with 4-Point Diffraction Cross Spikes
        ctx.shadowColor = '#c4b5fd';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(star.x - 5, star.y);
        ctx.lineTo(star.x + 5, star.y);
        ctx.moveTo(star.x, star.y - 5);
        ctx.lineTo(star.x, star.y + 5);
        ctx.stroke();
      } else {
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 3. High-Altitude Cirrus Cloud Wisps (Silky moonlit ice streaks)
    this.drawCirrusClouds(ctx);

    // 4. Masterpiece Photorealistic 3D Moon with Detailed Maria, Craters & Rays
    this.drawMasterpieceMoon(ctx, w, h, gy, levelTheme);

    // 5. Volumetric Billowing Cumulus Clouds with Silver Moonlight Rim
    this.drawVolumetricClouds(ctx, levelTheme);

    // 6. Layer 1: Distant Jagged Mountains / Cyber Skyline
    ctx.save();
    ctx.fillStyle = levelTheme.mountainColor;
    this.drawSkyline(ctx, this.offsetLayer1, gy - 75, 115, 0.42);
    ctx.restore();

    // 7. Layer 2: Deep Far Forest Silhouettes
    this.drawFarForest(ctx, this.offsetLayer2, gy - 20, levelTheme.mountainColor);

    // 8. Layer 3: Realistic Midground with Trees, Foliage, Cottages & Pagodas
    this.drawHomesAndTrees(ctx, this.offsetLayer3, gy, levelTheme);

    // 9. Delicate Bioluminescent Fireflies (আসল জোনাকি পোকা - বাবল মুক্ত)
    this.drawFireflies(ctx);

    // 10. Realistic Stratified Earth Land (মাটি, পাথুরে স্তর ও দোলায়মান ঘাস)
    this.drawRealisticLand(ctx, w, h, gy, levelTheme);
  }

  // Draw Deep Space Cosmic Nebula Dust Lanes (গ্যালাকটিক নেবুলা গ্যাস মেঘ)
  drawCosmicNebula(ctx, w, gy) {
    ctx.save();
    // Violet Nebula Lane
    const neb1 = ctx.createRadialGradient(w * 0.35, gy * 0.25, 20, w * 0.35, gy * 0.25, w * 0.45);
    neb1.addColorStop(0, 'rgba(147, 51, 234, 0.08)');
    neb1.addColorStop(0.5, 'rgba(126, 34, 206, 0.04)');
    neb1.addColorStop(1, 'transparent');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, w, gy);

    // Cyan/Teal Cosmic Gas Filament
    const neb2 = ctx.createRadialGradient(w * 0.72, gy * 0.18, 15, w * 0.72, gy * 0.18, w * 0.38);
    neb2.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
    neb2.addColorStop(0.6, 'rgba(14, 116, 144, 0.03)');
    neb2.addColorStop(1, 'transparent');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, w, gy);
    ctx.restore();
  }

  // Draw High-Altitude Wispy Cirrus Clouds (Luminous Ice Crystal Sheets)
  drawCirrusClouds(ctx) {
    ctx.save();
    for (const c of this.cirrusClouds) {
      // Silky feathered ice crystal cloud
      const grad = ctx.createLinearGradient(c.x, c.y, c.x + c.width, c.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.25, `rgba(186, 195, 235, ${c.alpha * 0.9})`);
      grad.addColorStop(0.5, `rgba(215, 225, 255, ${c.alpha * 1.35})`);
      grad.addColorStop(0.75, `rgba(175, 185, 230, ${c.alpha * 0.9})`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(c.x + c.width * 0.5, c.y + c.height * 0.5, c.width * 0.5, c.height * 0.5, -0.06, 0, Math.PI * 2);
      ctx.fill();

      // Delicate interior ice wisps
      ctx.strokeStyle = `rgba(240, 245, 255, ${c.alpha * 0.45})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(c.x + c.width * 0.2, c.y + c.height * 0.4);
      ctx.quadraticCurveTo(c.x + c.width * 0.5, c.y + c.height * 0.2, c.x + c.width * 0.8, c.y + c.height * 0.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw Volumetric Billowing Cumulus Clouds with Silver Moonlight Rim
  drawVolumetricClouds(ctx, levelTheme) {
    ctx.save();
    for (const cloud of this.volumetricClouds) {
      const cx = cloud.x + cloud.width * 0.5;
      const cy = cloud.y + cloud.height * 0.5;

      // 1. Dark shaded underbelly base (Atmospheric ambient occlusion)
      ctx.fillStyle = 'rgba(8, 6, 18, 0.72)';
      ctx.beginPath();
      for (const puff of cloud.puffs) {
        const px = cx + puff.rx * cloud.width;
        const py = cy + puff.ry * cloud.height + 6;
        const pr = puff.r * cloud.height * 1.18;
        ctx.arc(px, py, pr, 0, Math.PI * 2);
      }
      ctx.fill();

      // 2. Soft volumetric mid-body with lunar backscattering
      const bodyGrad = ctx.createRadialGradient(cx, cy - 10, cloud.height * 0.2, cx, cy + 2, cloud.width * 0.52);
      bodyGrad.addColorStop(0, `rgba(75, 68, 110, ${cloud.alpha * 1.25})`);
      bodyGrad.addColorStop(0.55, `rgba(32, 25, 56, ${cloud.alpha * 1.05})`);
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

      // 3. Bright Silver Moonlight Rim Highlight on Upper Crests
      ctx.strokeStyle = `rgba(255, 255, 255, ${cloud.alpha * 0.88})`;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = levelTheme.moonColor;
      ctx.shadowBlur = 12;
      for (const puff of cloud.puffs) {
        const px = cx + puff.rx * cloud.width;
        const py = cy + puff.ry * cloud.height;
        const pr = puff.r * cloud.height;
        ctx.beginPath();
        ctx.arc(px, py, pr, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Draw Photorealistic 3D Moon with Extensive Maria Basins, Ray Systems & Craters
  drawMasterpieceMoon(ctx, w, h, gy, levelTheme) {
    const moonX = Math.min(w * 0.78, w - 85);
    const moonY = Math.max(70, Math.min(h * 0.22, 160));
    const moonRadius = Math.max(38, Math.min(68, Math.floor(w * 0.11)));

    ctx.save();

    // 1. Cosmic Atmospheric Glow Halos
    const outerHalo = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.5);
    outerHalo.addColorStop(0, levelTheme.moonGlow);
    outerHalo.addColorStop(0.45, 'rgba(168, 85, 247, 0.08)');
    outerHalo.addColorStop(1, 'transparent');
    ctx.fillStyle = outerHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Prismatic Corona Ring (Diffraction Fringe)
    const coronaRing = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.95, moonX, moonY, moonRadius * 1.35);
    coronaRing.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    coronaRing.addColorStop(0.5, 'rgba(196, 181, 253, 0.25)');
    coronaRing.addColorStop(0.85, levelTheme.moonGlow);
    coronaRing.addColorStop(1, 'transparent');
    ctx.fillStyle = coronaRing;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 3. Volumetric Moonlight Beam Cone Streaming to Ground
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

    // Clip to spherical disc for geological surface features
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // 4. Base Spherical Lunar Gradient (3D light source from top-left)
    const sphereGrad = ctx.createRadialGradient(
      moonX - moonRadius * 0.3,
      moonY - moonRadius * 0.3,
      moonRadius * 0.08,
      moonX + moonRadius * 0.15,
      moonY + moonRadius * 0.15,
      moonRadius * 1.08
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.3, levelTheme.moonColor);
    sphereGrad.addColorStop(0.72, '#c4b5fd');
    sphereGrad.addColorStop(1.0, '#334155'); // Deep terminator shadow
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2);

    // 5. Lunar Maria (Dark Basaltic Volcanic Plains)
    ctx.fillStyle = 'rgba(28, 24, 42, 0.42)';

    // Oceanus Procellarum & Mare Imbrium (North-Western Basin)
    ctx.beginPath();
    ctx.ellipse(moonX - moonRadius * 0.28, moonY - moonRadius * 0.18, moonRadius * 0.44, moonRadius * 0.34, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mare Serenitatis & Tranquillitatis (Center-Eastern Seas)
    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.24, moonY - moonRadius * 0.1, moonRadius * 0.34, moonRadius * 0.28, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Mare Crisium (Crisp distinct oval on eastern limb)
    ctx.fillStyle = 'rgba(24, 18, 38, 0.48)';
    ctx.beginPath();
    ctx.ellipse(moonX + moonRadius * 0.54, moonY - moonRadius * 0.15, moonRadius * 0.17, moonRadius * 0.14, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Mare Nubium & Humorum (Southern Seas)
    ctx.fillStyle = 'rgba(28, 22, 44, 0.38)';
    ctx.beginPath();
    ctx.ellipse(moonX - moonRadius * 0.15, moonY + moonRadius * 0.32, moonRadius * 0.32, moonRadius * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 6. Tycho Impact Crater & Expansive Radial Ray System (Southern Hemisphere)
    const tychoX = moonX + moonRadius * 0.05;
    const tychoY = moonY + moonRadius * 0.54;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 1.2;
    const rayAngles = [-2.45, -2.15, -1.85, -1.55, -1.25, -0.85, -0.45, 0.08, 0.55];
    for (const angle of rayAngles) {
      const rayLen = moonRadius * (0.65 + Math.sin(angle * 4) * 0.25);
      ctx.beginPath();
      ctx.moveTo(tychoX, tychoY);
      ctx.lineTo(tychoX + Math.cos(angle) * rayLen, tychoY + Math.sin(angle) * rayLen);
      ctx.stroke();
    }
    // Tycho Central Crater Peak
    ctx.fillStyle = 'rgba(18, 14, 28, 0.75)';
    ctx.beginPath();
    ctx.arc(tychoX, tychoY, moonRadius * 0.075, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tychoX - 1, tychoY - 1, moonRadius * 0.038, 0, Math.PI * 2);
    ctx.fill();

    // 7. Realistic Impact Craters with Specular Sunlight Highlights & Deep Inner Shadows
    const craters = [
      { x: moonX - moonRadius * 0.42, y: moonY - moonRadius * 0.32, r: moonRadius * 0.09 }, // Copernicus
      { x: moonX - moonRadius * 0.08, y: moonY - moonRadius * 0.45, r: moonRadius * 0.075 }, // Plato
      { x: moonX + moonRadius * 0.34, y: moonY + moonRadius * 0.22, r: moonRadius * 0.08 },
      { x: moonX - moonRadius * 0.48, y: moonY + moonRadius * 0.15, r: moonRadius * 0.065 }, // Kepler
      { x: moonX + moonRadius * 0.12, y: moonY - moonRadius * 0.38, r: moonRadius * 0.06 },
    ];

    for (const c of craters) {
      ctx.fillStyle = 'rgba(14, 10, 24, 0.72)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Sunlit rim highlight on top-left
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(c.x - 0.8, c.y - 0.8, c.r * 0.85, Math.PI * 0.75, Math.PI * 1.75);
      ctx.stroke();

      // Central rebound peak
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Spherical Limb Darkening Ring (Atmospheric falloff at perimeter)
    const limbGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius);
    limbGrad.addColorStop(0, 'transparent');
    limbGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.22)');
    limbGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = limbGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // End disc clip

    // 9. Ultra-thin Specular Sunlit Rim Crescent on Exterior Edge
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, Math.PI * 0.85, Math.PI * 1.65);
    ctx.stroke();

    ctx.restore(); // End moon transform
  }

  // Draw Delicate Bioluminescent Fireflies (আসল জোনাকি পোকা - বাস্তব ডানা ও বায়োলুমিনেসেন্স, কোনো বাবল নয়)
  drawFireflies(ctx) {
    const now = Date.now() / 1000;
    ctx.save();

    for (const f of this.fireflies) {
      // Natural organic breathing pulse
      const pulse = Math.sin(now * f.pulseSpeed + f.pulseOffset);
      const intensity = Math.pow((pulse + 1) / 2, 2.5);
      const alpha = Math.max(0.15, intensity * f.maxAlpha);

      // Warm authentic firefly colors: Neon Chartreuse Lime or Warm Golden Spark
      const glowColor = f.colorType === 'lime' ? '#bef264' : '#fef08a';
      const bodyColor = '#1f2421'; // Natural dark insect cuticle

      ctx.save();
      ctx.translate(f.x, f.y);

      // Rapidly fluttering translucent micro-wings (25Hz)
      const wingFlap = Math.sin(now * f.wingFreq);
      ctx.fillStyle = `rgba(220, 240, 255, ${alpha * 0.45})`;
      ctx.beginPath();
      ctx.ellipse(-0.5, -2, 2.2, 0.9, wingFlap * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-0.5, 2, 2.2, 0.9, -wingFlap * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Tiny insect body (head & thorax)
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.ellipse(0.6, 0, 1.2, 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing bioluminescent abdomen lantern (sharp point light, no giant bubble disc)
      ctx.globalAlpha = alpha;
      ctx.fillStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 5 + intensity * 6; // Focused point light glow
      ctx.beginPath();
      ctx.arc(-0.8, 0, f.size * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  // Draw Realistic Stratified Land, Earth Sediments, Moonlit Rocky Crest, and Foliage
  drawRealisticLand(ctx, w, h, gy, levelTheme) {
    ctx.save();

    // 1. Solid Earth Foundation with Sedimentary Bedrock Gradient
    const groundGrad = ctx.createLinearGradient(0, gy, 0, h);
    groundGrad.addColorStop(0, levelTheme.groundColor);
    groundGrad.addColorStop(0.25, '#0b0818');
    groundGrad.addColorStop(0.65, '#070512');
    groundGrad.addColorStop(1.0, '#030208');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, gy, w, h - gy);

    // 2. Embedded Geological Flagstones & Shale Strata in Deep Soil
    for (const pebble of this.groundPebbles) {
      const px = ((pebble.relX - this.offsetGround) % w + w) % w;
      const py = gy + pebble.depth;

      ctx.fillStyle = pebble.shade;
      ctx.beginPath();
      ctx.roundRect(px, py, pebble.width, pebble.height, 2.5);
      ctx.fill();

      // Top edge highlight on stone
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + pebble.width, py);
      ctx.stroke();
    }

    // 3. Subterranean Bioluminescent Root Veins (Faint Earth Energy)
    ctx.strokeStyle = levelTheme.gridColor;
    ctx.lineWidth = 1.2;
    for (let rx = -this.offsetGround; rx < w; rx += 70) {
      ctx.beginPath();
      ctx.moveTo(rx, gy + 4);
      ctx.quadraticCurveTo(rx - 8, gy + 28, rx - 14, gy + 55);
      ctx.quadraticCurveTo(rx - 20, gy + 75, rx - 16, h);
      ctx.stroke();
    }

    // 4. Horizontal Geological Strata Compression Lines
    [gy + 16, gy + 38, gy + 72].forEach((lineY) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(w, lineY);
      ctx.stroke();
    });

    // 5. Texturized Rocky Crest & Moonlit Edge Line
    // Rich textured crest tracing the natural rock shelves
    ctx.strokeStyle = levelTheme.groundAccent;
    ctx.lineWidth = 3.2;
    ctx.shadowColor = levelTheme.groundAccent;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();

    // Secondary Moonlit Silver Moss Crest Line
    ctx.strokeStyle = 'rgba(240, 245, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(0, gy - 0.5);
    ctx.lineTo(w, gy - 0.5);
    ctx.stroke();

    // 6. Rolling Ground Fog / Nocturnal Mist
    const fogGrad = ctx.createLinearGradient(0, gy - 24, 0, gy + 10);
    fogGrad.addColorStop(0, 'transparent');
    fogGrad.addColorStop(0.65, levelTheme.moonGlow);
    fogGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fogGrad;
    ctx.globalAlpha = 0.38;
    ctx.fillRect(0, gy - 24, w, 34);
    ctx.globalAlpha = 1.0;

    // 7. Dense Natural Swaying Grass Blades, Wild Reeds & Spores
    const time = Date.now() / 420;
    ctx.strokeStyle = '#1a1330';
    ctx.lineWidth = 1.8;
    for (let gx = 0; gx < w; gx += 12) {
      const sway = Math.sin(time + gx * 0.12) * 4.5;
      const bladeH = 7 + Math.abs(Math.sin(gx * 0.22)) * 9;

      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx + sway * 0.5, gy - bladeH * 0.6, gx + sway, gy - bladeH);
      ctx.stroke();

      // Rare glowing spore blossom atop grass blade
      if (gx % 48 === 0) {
        ctx.fillStyle = levelTheme.groundAccent;
        ctx.beginPath();
        ctx.arc(gx + sway, gy - bladeH - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

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

  // Draw Realistic Midground with Trees, Foliage, Cottages & Pagodas
  drawHomesAndTrees(ctx, offset, groundY, levelTheme) {
    const spacing = 320;
    const count = Math.ceil(this.width / spacing) + 3;

    for (let i = -1; i < count; i++) {
      const baseX = i * spacing - offset;

      // Traditional Cottage or Pagoda
      if (i % 2 === 0) {
        this.drawCottage(ctx, baseX + 40, groundY, levelTheme);
      } else {
        this.drawPagoda(ctx, baseX + 60, groundY, levelTheme);
      }

      // Realistic Anatomical Pine / Bonsai Shadow Trees
      this.drawRealisticPineTree(ctx, baseX + 190, groundY, 75, levelTheme);
      this.drawBroadleafTree(ctx, baseX + 280, groundY, 65, levelTheme);
    }
  }

  // Draw Traditional Cottage with Glowing Amber Shoji Windows
  drawCottage(ctx, x, groundY, levelTheme) {
    ctx.save();
    const w = 55;
    const h = 42;
    const y = groundY - h;

    // Walls
    ctx.fillStyle = '#0e0b1c';
    ctx.fillRect(x, y + 14, w, h - 14);

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

    // Chimney
    ctx.fillStyle = '#141026';
    ctx.fillRect(x + w - 14, y - 2, 7, 16);
    ctx.fillRect(x + w - 16, y - 4, 11, 3);

    // Warm Glowing Amber Shoji Window
    ctx.save();
    const winX = x + 12;
    const winY = y + 20;
    const winW = 18;
    const winH = 14;

    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.fillRect(winX, winY, winW, winH);

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
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x + 38, y + 22, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Draw Pagoda Tower
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
    ctx.lineTo(x + 24, baseY - 84);
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

  // Draw Japanese Shadow Pine
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

      ctx.beginPath();
      ctx.ellipse(px, py, pad.w, pad.h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Delicate serrated needle rim
      ctx.beginPath();
      for (let nx = px - pad.w * 0.8; nx <= px + pad.w * 0.8; nx += 4) {
        ctx.moveTo(nx, py - pad.h * 0.6);
        ctx.lineTo(nx + 1.5, py - pad.h * 0.9);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Broadleaf Shadow Tree
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

    // Canopy Clumps
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
}
