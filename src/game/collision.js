// Collision Detection engine for Shadow Runner

import { sound } from './audio';

export function checkAABB(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}

export function handleCollisions({
  player,
  obstacleManager,
  powerupManager,
  particleSystem,
  onGameOver,
  onCoinCollected,
  onShieldSaved,
}) {
  const playerBox = player.getHitbox();
  const activePowers = powerupManager.active;

  // 1. Coin collisions
  for (const coin of obstacleManager.coins) {
    if (coin.collected) continue;
    const coinBox = coin.getHitbox();
    if (checkAABB(playerBox, coinBox)) {
      coin.collected = true;
      sound.playCoin();
      if (particleSystem) {
        particleSystem.addCoinCollect(coin.x, coin.y, '+1');
      }
      onCoinCollected?.();
    }
  }

  // 2. Power-up Token collisions
  for (const token of powerupManager.tokens) {
    if (token.collected) continue;
    const tokenBox = token.getHitbox();
    if (checkAABB(playerBox, tokenBox)) {
      powerupManager.collect(token, particleSystem);
    }
  }

  // 3. Obstacle collisions
  if (player.invulnerableTimer > 0) {
    // Currently invulnerable (e.g. just broke shield)
    return;
  }

  for (let i = obstacleManager.obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacleManager.obstacles[i];
    const obsBox = obstacle.getHitbox();

    if (checkAABB(playerBox, obsBox)) {
      // Case A: Speed Boost active -> Smash obstacle!
      if (activePowers.speedBoost) {
        obstacleManager.obstacles.splice(i, 1);
        sound.playHit();
        if (particleSystem) {
          particleSystem.addExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, '#00f5ff');
        }
        continue;
      }

      // Case B: Shield active -> Absorb hit, break shield, grant invulnerability!
      if (activePowers.shield) {
        activePowers.shield = false;
        player.invulnerableTimer = 1.2; // 1.2s invulnerability
        obstacleManager.obstacles.splice(i, 1);
        sound.playShieldBreak();
        if (particleSystem) {
          particleSystem.addShieldBreak(player.x + player.width / 2, player.y + player.height / 2);
        }
        onShieldSaved?.();
        continue;
      }

      // Case C: Lethal hit -> Game Over!
      sound.playHit();
      if (particleSystem) {
        particleSystem.addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444');
      }
      onGameOver?.();
      return;
    }
  }
}
