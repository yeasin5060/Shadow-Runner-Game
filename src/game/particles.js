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
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() * 8 - 4),
        y: y - 2,
        vx: -2 - Math.random() * 2,
        vy: -0.5 - Math.random() * 1.5,
        size: 2.5 + Math.random() * 2.5,
        color,
        alpha: 0.6,
        life: 0.25 + Math.random() * 0.2,
        maxLife: 0.45,
      });
    }
  }

  // Jump burst
  addJumpBurst(x, y, color = '#a855f7') {
    for (let i = 0; i < 12; i++) {
      const angle = Math.PI * 0.5 + (Math.random() * 1.4 - 0.7);
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        alpha: 0.9,
        life: 0.35 + Math.random() * 0.25,
        maxLife: 0.6,
      });
    }
  }

  // Double jump shockwave & spark ring
  addDoubleJumpEffect(x, y, color = '#00f5ff') {
    this.shockwaves.push({
      x,
      y,
      radius: 8,
      maxRadius: 45,
      color,
      alpha: 1,
      lineWidth: 4,
    });

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const speed = 3 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 2.5,
        color,
        alpha: 1,
        life: 0.4 + Math.random() * 0.2,
        maxLife: 0.6,
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
      life: 0.7,
      maxLife: 0.7,
    });

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#fbbf24' : '#fef08a',
        alpha: 1,
        life: 0.35 + Math.random() * 0.25,
        maxLife: 0.6,
      });
    }
  }

  // Shield break
  addShieldBreak(x, y) {
    this.shockwaves.push({
      x,
      y,
      radius: 12,
      maxRadius: 65,
      color: '#38bdf8',
      alpha: 1,
      lineWidth: 5,
    });

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        color: '#38bdf8',
        alpha: 1,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
      });
    }
  }

  // Lethal collision explosion
  addExplosion(x, y, color = '#ef4444') {
    this.shockwaves.push({
      x,
      y,
      radius: 15,
      maxRadius: 80,
      color: '#ff4444',
      alpha: 1,
      lineWidth: 6,
    });

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 6,
        color: Math.random() > 0.4 ? color : '#f97316',
        alpha: 1,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0,
      });
    }
  }

  // Speed boost trail streak
  addSpeedTrail(x, y, width, height, color = '#00f5ff') {
    this.particles.push({
      x: x - Math.random() * 10,
      y: y + Math.random() * height,
      vx: -(7 + Math.random() * 5),
      vy: (Math.random() - 0.5) * 1.5,
      size: 2 + Math.random() * 3,
      length: 15 + Math.random() * 20,
      color,
      alpha: 0.7,
      life: 0.25,
      maxLife: 0.25,
      isStreak: true,
    });
  }

  update(dt) {
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

    // Draw shockwaves
    for (const s of this.shockwaves) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.lineWidth * s.alpha;
      ctx.globalAlpha = s.alpha;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
    }

    // Draw particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

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
    ctx.font = 'bold 16px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    for (const t of this.floatingTexts) {
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
      ctx.fillText(t.text, t.x, t.y);
    }

    ctx.restore();
  }
}
