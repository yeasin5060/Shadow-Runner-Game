// Obstacle and Coin spawning & rendering for Shadow Runner

import { sound } from './audio';

export class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 11;
    this.animTimer = Math.random() * Math.PI * 2;
    this.collected = false;
  }

  update(dt, gameSpeed, player, magnetActive) {
    this.x -= gameSpeed;
    this.animTimer += dt * 5;

    // Magnet power-up attraction
    if (magnetActive && !this.collected) {
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const dx = playerCenterX - this.x;
      const dy = playerCenterY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 280) {
        // Accelerate towards player
        const pullSpeed = 16 * (1 - dist / 350) + 6;
        this.x += (dx / dist) * pullSpeed;
        this.y += (dy / dist) * pullSpeed;
      }
    }
  }

  draw(ctx) {
    if (this.collected) return;

    const floatY = this.y + Math.sin(this.animTimer) * 3;
    const pulse = Math.abs(Math.sin(this.animTimer));
    const currentRadius = this.radius * (0.85 + pulse * 0.15);

    // Outer soft glow halo (hardware-accelerated, 0ms blur cost)
    ctx.beginPath();
    ctx.arc(this.x, floatY, currentRadius + 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.fill();

    // Outer gold ring
    ctx.beginPath();
    ctx.arc(this.x, floatY, currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Inner glowing core
    ctx.beginPath();
    ctx.arc(this.x, floatY, currentRadius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    // Center shadow glyph
    ctx.fillStyle = '#78350f';
    ctx.fillRect(this.x - 2, floatY - 4, 4, 8);
  }

  getHitbox() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }
}

export class Obstacle {
  constructor(x, groundY, type) {
    this.x = x;
    this.groundY = groundY;
    this.type = type; // 'stone', 'crate', 'spikes', 'laser', 'drone'
    this.passed = false;
    this.animTimer = 0;

    // Configure size and coordinates based on type
    switch (type) {
      case 'stone':
        this.width = 46;
        this.height = 36;
        this.y = groundY - this.height;
        break;
      case 'crate':
        this.width = 48;
        this.height = 52;
        this.y = groundY - this.height;
        break;
      case 'spikes':
        this.width = 62;
        this.height = 34;
        this.y = groundY - this.height;
        break;
      case 'laser':
        this.width = 22;
        this.height = 90;
        this.y = groundY - this.height;
        break;
      case 'drone':
        this.width = 54;
        this.height = 38;
        // Flying mid-air obstacle: player can slide underneath or double-jump over
        this.y = groundY - 110;
        this.baseY = this.y;
        break;
      default:
        this.width = 44;
        this.height = 40;
        this.y = groundY - this.height;
    }
  }

  update(dt, gameSpeed) {
    this.x -= gameSpeed;
    this.animTimer += dt;

    if (this.type === 'drone') {
      // Hovering sine motion
      this.y = this.baseY + Math.sin(this.animTimer * 4) * 12;
    }
  }

  draw(ctx, groundAccent = '#a855f7') {
    ctx.save();
    const ox = this.x;
    const oy = this.y;
    const ow = this.width;
    const oh = this.height;

    switch (this.type) {
      case 'stone': {
        // Jagged dark obsidian boulder with glowing cracks
        ctx.fillStyle = '#171726';
        ctx.strokeStyle = groundAccent;
        ctx.lineWidth = 2.2;

        ctx.beginPath();
        ctx.moveTo(ox + 4, oy + oh);
        ctx.lineTo(ox + 12, oy + 8);
        ctx.lineTo(ox + ow - 14, oy + 2);
        ctx.lineTo(ox + ow, oy + 18);
        ctx.lineTo(ox + ow - 4, oy + oh);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner crack
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox + 20, oy + 12);
        ctx.lineTo(ox + 26, oy + 24);
        ctx.lineTo(ox + 34, oy + 20);
        ctx.stroke();
        break;
      }

      case 'crate': {
        // Cyber tech security container
        ctx.fillStyle = '#1e1c2e';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(ox, oy, ow, oh, 5);
        ctx.fill();
        ctx.stroke();

        // Cross bracing & hazard stripes
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.moveTo(ox + 6, oy + 6);
        ctx.lineTo(ox + ow - 6, oy + oh - 6);
        ctx.moveTo(ox + ow - 6, oy + 6);
        ctx.lineTo(ox + 6, oy + oh - 6);
        ctx.stroke();

        // Center core
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ox + ow / 2, oy + oh / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'spikes': {
        // Razor metal ground spikes
        ctx.fillStyle = '#181824';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;

        const spikeCount = 3;
        const spikeW = ow / spikeCount;

        ctx.beginPath();
        ctx.moveTo(ox, oy + oh);
        for (let i = 0; i < spikeCount; i++) {
          const sx = ox + i * spikeW;
          ctx.lineTo(sx + spikeW / 2, oy);
          ctx.lineTo(sx + spikeW, oy + oh);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }

      case 'laser': {
        // High-energy electric laser barrier with multi-layer bloom
        ctx.fillStyle = '#111827';
        // Base and top emitter posts
        ctx.fillRect(ox - 3, oy + oh - 10, ow + 6, 10);
        ctx.fillRect(ox - 3, oy, ow + 6, 10);

        // Soft outer energy glow beam (no shadowBlur needed!)
        const beamPulse = Math.sin(this.animTimer * 18);
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.35)';
        ctx.lineWidth = 10 + beamPulse * 2;
        ctx.beginPath();
        ctx.moveTo(ox + ow / 2, oy + 10);
        ctx.lineTo(ox + ow / 2, oy + oh - 10);
        ctx.stroke();

        // Vivid inner laser beam
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(ox + ow / 2, oy + 10);
        ctx.lineTo(ox + ow / 2, oy + oh - 10);
        ctx.stroke();

        // White hot plasma core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox + ow / 2, oy + 10);
        ctx.lineTo(ox + ow / 2, oy + oh - 10);
        ctx.stroke();

        // Electric spark arcs
        if (Math.random() < 0.3) {
          const arcY = oy + 10 + Math.random() * (oh - 20);
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ox + ow / 2, arcY);
          ctx.lineTo(ox + ow / 2 + (Math.random() - 0.5) * 14, arcY + (Math.random() - 0.5) * 8);
          ctx.stroke();
        }
        break;
      }

      case 'drone': {
        // Conical Searching Spotlight Beam onto ground
        ctx.save();
        const beamSweep = Math.sin(this.animTimer * 3.5) * 24;
        const spotlight = ctx.createLinearGradient(ox + ow / 2, oy + oh / 2, ox + ow / 2 + beamSweep, this.groundY);
        spotlight.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
        spotlight.addColorStop(1, 'transparent');
        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.moveTo(ox + ow / 2, oy + oh / 2);
        ctx.lineTo(ox + ow / 2 - 38 + beamSweep, this.groundY);
        ctx.lineTo(ox + ow / 2 + 38 + beamSweep, this.groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Shadow Recon Drone
        ctx.fillStyle = '#111222';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;

        // Drone main fuselage
        ctx.beginPath();
        ctx.ellipse(ox + ow / 2, oy + oh / 2, ow / 2, oh / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sensor eye
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ox + ow / 2 + Math.sin(this.animTimer * 6) * 6, oy + oh / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Wings / Blades
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;
        const wingPulse = Math.sin(this.animTimer * 25) * 8;
        ctx.beginPath();
        ctx.moveTo(ox - 8, oy + oh / 2 + wingPulse);
        ctx.lineTo(ox + 6, oy + oh / 2);
        ctx.moveTo(ox + ow + 8, oy + oh / 2 - wingPulse);
        ctx.lineTo(ox + ow - 6, oy + oh / 2);
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  getHitbox() {
    // Tightened hitbox for fair gameplay
    const paddingX = 4;
    const paddingTop = 4;
    return {
      x: this.x + paddingX,
      y: this.y + paddingTop,
      width: this.width - paddingX * 2,
      height: this.height - paddingTop,
    };
  }
}

export class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.coins = [];
    this.lastSpawnTime = 0;
    this.nextSpawnInterval = 1600;
  }

  reset() {
    this.obstacles = [];
    this.coins = [];
    this.lastSpawnTime = 0;
    this.nextSpawnInterval = 1600;
  }

  update(dt, currentTime, gameSpeed, currentLevel, groundY, player, magnetActive) {
    // Spawn Obstacles & Coins based on level
    if (currentTime - this.lastSpawnTime >= this.nextSpawnInterval) {
      this.lastSpawnTime = currentTime;
      this.nextSpawnInterval =
        currentLevel.obstacleIntervalMin +
        Math.random() * (currentLevel.obstacleIntervalMax - currentLevel.obstacleIntervalMin);

      const spawnX = Math.max(player.canvasWidth + 40, player.x + 550);
      this.spawnObstaclePattern(spawnX, groundY, currentLevel);
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(dt, gameSpeed);

      if (obs.x + obs.width < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // Update Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.update(dt, gameSpeed, player, magnetActive);

      if (coin.x + coin.radius < -50 || coin.collected) {
        this.coins.splice(i, 1);
      }
    }
  }

  spawnObstaclePattern(spawnX, groundY, currentLevel) {
    const allowed = currentLevel.allowedObstacles;
    const type = allowed[Math.floor(Math.random() * allowed.length)];

    const obstacle = new Obstacle(spawnX, groundY, type);
    this.obstacles.push(obstacle);

    // Spawn coin arc or trail
    if (Math.random() < currentLevel.coinSpawnChance) {
      if (type === 'drone') {
        // Low trail under drone or high arc over drone
        for (let i = 0; i < 3; i++) {
          this.coins.push(new Coin(spawnX + i * 36, groundY - 25));
        }
      } else {
        // High arc over ground obstacle
        for (let i = 0; i < 4; i++) {
          const arcOffset = Math.sin((i / 3) * Math.PI) * 70;
          this.coins.push(new Coin(spawnX - 20 + i * 35, groundY - obstacle.height - 40 - arcOffset));
        }
      }
    }
  }

  draw(ctx, groundAccent) {
    // Draw coins first
    for (const coin of this.coins) {
      coin.draw(ctx);
    }

    // Draw obstacles
    for (const obs of this.obstacles) {
      obs.draw(ctx, groundAccent);
    }
  }

  adjustGround(newGroundY, dy) {
    for (const obs of this.obstacles) {
      obs.groundY = newGroundY;
      if (obs.type === 'drone') {
        obs.baseY = newGroundY - 110;
        obs.y = obs.baseY;
      } else {
        obs.y = newGroundY - obs.height;
      }
    }
    for (const coin of this.coins) {
      coin.y += dy;
    }
  }
}
