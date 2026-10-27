// High-performance Particle and FX System for Shadow Runner

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
  }

  // Running footstep dust
  addFootstepDust(x, y, color = '#6b7280') {
    if (this.particles.length > 50) return;
    this.particles.push({
      x: x + (Math.random() * 6 - 3),
      y: y - 2,
      vx: -2 - Math.random() * 1.5,
      vy: -0.5 - Math.random() * 1.0,
      size: 2 + Math.random() * 2,
      color,
      alpha: 0.6,
      life: 0.22,
      maxLife: 0.22,
    });
  }

  // Jump burst
  addJumpBurst(x, y, color = '#a855f7') {
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 0.5 + (Math.random() * 1.2 - 0.6);
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 2.5,
        color,
        alpha: 0.9,
        life: 0.3,
        maxLife: 0.3,
      });
    }
  }

  // Double jump shockwave & spark ring
  addDoubleJumpEffect(x, y, color = '#00f5ff') {
    this.shockwaves.push({
      x,
      y,
      radius: 8,
      maxRadius: 40,
      color,
      alpha: 1,
      lineWidth: 3,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 3 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 2,
        color,
        alpha: 1,
        life: 0.35,
        maxLife: 0.35,
      });
    }
  }

  // Coin collect sparkles and floating score text
  addCoinCollect(x, y, text = '+1') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color: '#fbbf24',
      alpha: 1,
      vy: -1.8,
      life: 0.6,
      maxLife: 0.6,
    });

    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? '#fbbf24' : '#fef08a',
        alpha: 1,
        life: 0.3,
        maxLife: 0.3,
      });
    }
  }

  // Shield break
  addShieldBreak(x, y) {
    this.shockwaves.push({
      x,
      y,
      radius: 12,
      maxRadius: 55,
      color: '#38bdf8',
      alpha: 1,
      lineWidth: 4,
    });

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: '#38bdf8',
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
      });
    }
  }

  // Lethal collision explosion
  addExplosion(x, y, color = '#ef4444') {
    this.shockwaves.push({
      x,
      y,
      radius: 15,
      maxRadius: 65,
      color: '#ff4444',
      alpha: 1,
      lineWidth: 5,
    });

    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.4 ? color : '#f97316',
        alpha: 1,
        life: 0.45,
        maxLife: 0.45,
      });
    }
  }

  // Speed boost trail streak
  addSpeedTrail(x, y, width, height, color = '#00f5ff') {
    if (this.particles.length > 40) return;
    this.particles.push({
      x: x - Math.random() * 8,
      y: y + Math.random() * height,
      vx: -(6 + Math.random() * 4),
      vy: (Math.random() - 0.5) * 1.2,
      size: 2 + Math.random() * 2,
      length: 12 + Math.random() * 14,
      color,
      alpha: 0.7,
      life: 0.2,
      maxLife: 0.2,
      isStreak: true,
    });
  }

  update(dt) {
    // Cap particle count
    if (this.particles.length > 60) {
      this.particles.splice(0, this.particles.length - 60);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      t.y += t.vy;
      t.alpha = Math.max(0, t.life / t.maxLife);
    }

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.radius += (s.maxRadius - s.radius) * 10 * dt;
      s.alpha = Math.max(0, 1 - s.radius / s.maxRadius);
      if (s.alpha <= 0.05 || s.radius >= s.maxRadius - 2) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw shockwaves (clean sharp geometric rings, no CPU blur bottleneck)
    for (const s of this.shockwaves) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.lineWidth * s.alpha;
      ctx.globalAlpha = s.alpha;
      ctx.stroke();
    }

    // Draw particles (ultra-fast direct rendering with alpha blending)
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.isStreak) {
        ctx.beginPath();
        ctx.rect(p.x, p.y, p.length || 15, p.size);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw floating texts (+1 coins etc)
    ctx.font = 'bold 15px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    for (const t of this.floatingTexts) {
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }

    ctx.restore();
  }
}
