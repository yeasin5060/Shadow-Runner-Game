// Power-up Entities and State Management for Shadow Runner

import { sound } from './audio';

export const POWERUP_TYPES = {
  SHIELD: {
    id: 'shield',
    name: 'Shadow Aegis',
    desc: 'Absorbs 1 fatal collision',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    duration: 0, // Lasts until hit
    icon: 'Shield',
  },
  MAGNET: {
    id: 'magnet',
    name: 'Orb Magnet',
    desc: 'Pulls all nearby coins to you',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.9)',
    duration: 8.0, // 8 seconds
    icon: 'Magnet',
  },
  SPEED: {
    id: 'speedBoost',
    name: 'Shadow Rush',
    desc: 'Hyper speed, invincibility & 2x score',
    color: '#00f5ff',
    glowColor: 'rgba(0, 245, 255, 0.9)',
    duration: 5.0, // 5 seconds
    icon: 'Zap',
  },
};

export class PowerupToken {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // POWERUP_TYPES.SHIELD, etc.
    this.width = 36;
    this.height = 36;
    this.animTimer = Math.random() * Math.PI * 2;
    this.collected = false;
  }

  update(dt, gameSpeed) {
    this.x -= gameSpeed;
    this.animTimer += dt * 3.5;
  }

  draw(ctx) {
    if (this.collected) return;

    ctx.save();
    const floatY = this.y + Math.sin(this.animTimer) * 5;
    const cx = this.x + this.width / 2;
    const cy = floatY + this.height / 2;

    // Outer glow aura
    ctx.shadowColor = this.type.glowColor;
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(15, 15, 30, 0.9)';
    ctx.strokeStyle = this.type.color;
    ctx.lineWidth = 2.5;

    // Diamond shaped token
    ctx.beginPath();
    ctx.moveTo(cx, cy - 18);
    ctx.lineTo(cx + 18, cy);
    ctx.lineTo(cx, cy + 18);
    ctx.lineTo(cx - 18, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner icon symbol
    ctx.fillStyle = this.type.color;
    ctx.beginPath();
    if (this.type.id === 'shield') {
      // Shield crest
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 8, cy - 4);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.lineTo(cx, cy + 10);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.lineTo(cx - 8, cy - 4);
      ctx.closePath();
    } else if (this.type.id === 'magnet') {
      // Horseshoe magnet
      ctx.arc(cx, cy - 2, 7, Math.PI, 0, false);
      ctx.lineTo(cx + 7, cy + 6);
      ctx.lineTo(cx + 3, cy + 6);
      ctx.lineTo(cx + 3, cy);
      ctx.arc(cx, cy, 3, 0, Math.PI, true);
      ctx.lineTo(cx - 3, cy + 6);
      ctx.lineTo(cx - 7, cy + 6);
      ctx.closePath();
    } else {
      // Lightning bolt
      ctx.moveTo(cx + 2, cy - 9);
      ctx.lineTo(cx - 5, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - 2, cy + 9);
      ctx.lineTo(cx + 5, cy);
      ctx.lineTo(cx, cy);
      ctx.closePath();
    }
    ctx.fill();

    ctx.restore();
  }

  getHitbox() {
    return {
      x: this.x + 2,
      y: this.y + 2,
      width: this.width - 4,
      height: this.height - 4,
    };
  }
}

export class PowerupManager {
  constructor() {
    this.tokens = [];
    this.active = {
      shield: false,
      magnet: false,
      magnetTimer: 0,
      magnetMax: 8.0,
      speedBoost: false,
      speedBoostTimer: 0,
      speedBoostMax: 5.0,
    };
  }

  reset() {
    this.tokens = [];
    this.active = {
      shield: false,
      magnet: false,
      magnetTimer: 0,
      magnetMax: 8.0,
      speedBoost: false,
      speedBoostTimer: 0,
      speedBoostMax: 5.0,
    };
  }

  spawnRandom(x, groundY) {
    const keys = Object.keys(POWERUP_TYPES);
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];
    const type = POWERUP_TYPES[selectedKey];
    
    // Spawn floating at a nice jumpable height
    const floatHeights = [groundY - 120, groundY - 75, groundY - 160];
    const y = floatHeights[Math.floor(Math.random() * floatHeights.length)];
    this.tokens.push(new PowerupToken(x, y, type));
  }

  collect(token, particleSystem) {
    token.collected = true;
    sound.playPowerup();

    if (token.type.id === 'shield') {
      this.active.shield = true;
    } else if (token.type.id === 'magnet') {
      this.active.magnet = true;
      this.active.magnetTimer = this.active.magnetMax;
    } else if (token.type.id === 'speedBoost') {
      this.active.speedBoost = true;
      this.active.speedBoostTimer = this.active.speedBoostMax;
    }

    if (particleSystem) {
      particleSystem.addCoinCollect(token.x + 18, token.y + 18, token.type.name);
    }
  }

  update(dt, gameSpeed, player, particleSystem) {
    // Update active timers
    if (this.active.magnet) {
      this.active.magnetTimer -= dt;
      if (this.active.magnetTimer <= 0) {
        this.active.magnet = false;
        this.active.magnetTimer = 0;
      }
    }

    if (this.active.speedBoost) {
      this.active.speedBoostTimer -= dt;
      if (this.active.speedBoostTimer <= 0) {
        this.active.speedBoost = false;
        this.active.speedBoostTimer = 0;
      }
    }

    // Update tokens on screen
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      const token = this.tokens[i];
      token.update(dt, gameSpeed);

      // Despawn off screen
      if (token.x + token.width < -50 || token.collected) {
        this.tokens.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const token of this.tokens) {
      token.draw(ctx);
    }
  }
}
