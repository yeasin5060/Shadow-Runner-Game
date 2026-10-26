// Score, Distance, and Progress Tracker for Shadow Runner

import { storage } from '../utils/storage';
import { getLevelForDistance } from './levels';
import { sound } from './audio';

export class ScoreSystem {
  constructor() {
    this.distance = 0; // meters
    this.coins = 0;
    this.score = 0; // total composite score = distance * multiplier + coins * 25
    this.bestScore = storage.getBestScore();
    this.currentLevel = getLevelForDistance(0);
    this.scoreMultiplier = 1;
    this.onLevelUpCallback = null;
  }

  reset() {
    this.distance = 0;
    this.coins = 0;
    this.score = 0;
    this.bestScore = storage.getBestScore();
    this.currentLevel = getLevelForDistance(0);
    this.scoreMultiplier = 1;
  }

  update(dt, speed, speedBoostActive) {
    this.scoreMultiplier = speedBoostActive ? 2 : 1;
    const distanceGain = (speed * 2.8 * dt) * this.scoreMultiplier;
    this.distance += distanceGain;

    // Total score calculation
    this.score = Math.floor(this.distance + this.coins * 25);

    // Check level progression
    const newLevel = getLevelForDistance(this.distance);
    if (newLevel.level > this.currentLevel.level) {
      this.currentLevel = newLevel;
      sound.playLevelUp();
      sound.updateTempo(newLevel.level);
      this.onLevelUpCallback?.(newLevel);
    }

    // High score check
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      storage.setBestScore(this.bestScore);
    }
  }

  addCoin() {
    this.coins++;
    this.score = Math.floor(this.distance + this.coins * 25);
    storage.addCoins(1);

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      storage.setBestScore(this.bestScore);
    }
  }
}
