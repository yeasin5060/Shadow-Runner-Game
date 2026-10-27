// Central Game Engine Hook for Shadow Runner

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../game/player';
import { ObstacleManager } from '../game/obstacles';
import { PowerupManager } from '../game/powerups';
import { ParticleSystem } from '../game/particles';
import { ScoreSystem } from '../game/score';
import { ParallaxBackground } from '../game/background';
import { handleCollisions } from '../game/collision';
import { sound } from '../game/audio';
import { storage } from '../utils/storage';

export function useGameEngine() {
  const canvasRef = useRef(null);

  // High-level Game States
  const [gameState, setGameState] = useState('MENU'); // 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
  const [selectedSkin, setSelectedSkin] = useState(storage.getSelectedSkin());
  const [scoreData, setScoreData] = useState({
    distance: 0,
    coins: 0,
    score: 0,
    bestScore: storage.getBestScore(),
    level: 1,
    levelName: 'Beginner',
    levelTitle: 'Twilight Forest',
    multiplier: 1,
  });

  const [powerupStatus, setPowerupStatus] = useState({
    shield: false,
    magnet: false,
    magnetTimer: 0,
    magnetMax: 8.0,
    speedBoost: false,
    speedBoostTimer: 0,
    speedBoostMax: 5.0,
  });

  const [toastNotification, setToastNotification] = useState(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );
  const lastJumpTimeRef = useRef(0);

  // Engine Internals Refs
  const engineRef = useRef({
    player: null,
    obstacles: null,
    powerups: null,
    particles: null,
    score: null,
    background: null,
    groundY: 0,
    lastTime: 0,
    animationFrameId: null,
    isRunning: false,
    powerupsUsedCount: 0,
  });

  const showToast = useCallback((title, message, icon = 'Award') => {
    setToastNotification({ title, message, icon });
    setTimeout(() => {
      setToastNotification(null);
    }, 3800);
  }, []);

  // Check achievements helper
  const checkAchievements = useCallback((stats) => {
    if (stats.isFirstRun) {
      const ach = storage.unlockAchievement('first_run');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
    if (stats.distance >= 500) {
      const ach = storage.unlockAchievement('reach_500m');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
    if (stats.distance >= 1500) {
      const ach = storage.unlockAchievement('reach_1500m');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
    if (stats.doubleJumps >= 20) {
      const ach = storage.unlockAchievement('double_jumper');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
    if (storage.getTotalCoins() >= 100) {
      const ach = storage.unlockAchievement('coin_hoarder');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
    if (stats.speedBoosts >= 3) {
      const ach = storage.unlockAchievement('speed_demon');
      if (ach) showToast('Achievement Unlocked!', ach.title);
    }
  }, [showToast]);

  // Initialize or Reset Engine
  const initEngine = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width || window.innerWidth;
    const height = canvas.height || window.innerHeight;
    const groundY = Math.max(160, height - Math.min(110, Math.floor(height * 0.22)));

    const player = new Player(width, height, groundY);
    player.setSkin(selectedSkin);

    const obstacles = new ObstacleManager();
    const powerups = new PowerupManager();
    const particles = new ParticleSystem();
    const score = new ScoreSystem();
    const background = new ParallaxBackground(width, height, groundY);

    score.onLevelUpCallback = (lvl) => {
      showToast(`Level ${lvl.level} Reached!`, lvl.title, 'Zap');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    };

    engineRef.current = {
      player,
      obstacles,
      powerups,
      particles,
      score,
      background,
      groundY,
      lastTime: performance.now(),
      animationFrameId: null,
      isRunning: false,
      powerupsUsedCount: 0,
      lastHudUpdate: 0,
      shake: { intensity: 0 },
      jumpBuffer: 0,
    };
  }, [selectedSkin, showToast]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    const engine = engineRef.current;
    engine.isRunning = false;
    sound.stopBgm();

    // Dramatic screen shake on fatal crash
    if (engine.shake) engine.shake.intensity = 16;

    const finalScore = engine.score.score;
    const previousBest = storage.getBestScore();
    const isNewRecord = finalScore > previousBest && finalScore > 0;

    setIsNewHighScore(isNewRecord);
    if (isNewRecord) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }

    // Save score to leaderboard
    storage.saveLeaderboardScore('You', finalScore, engine.score.distance);

    // Update Daily Challenge
    storage.updateDailyChallenge('distance', Math.floor(engine.score.distance));
    storage.updateDailyChallenge('coins', engine.score.coins);
    storage.updateDailyChallenge('doubleJumps', engine.player.totalDoubleJumps);
    storage.updateDailyChallenge('powerups', engine.powerupsUsedCount);

    // Achievements check
    checkAchievements({
      isFirstRun: true,
      distance: engine.score.distance,
      doubleJumps: engine.player.totalDoubleJumps,
      coins: engine.score.coins,
      speedBoosts: engine.powerupsUsedCount,
    });

    setGameState('GAMEOVER');
  }, [checkAchievements]);

  // Game Loop
  const gameLoop = useCallback((timestamp) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!engine.isRunning) {
      // Still draw background & player idle breathing in menu or paused
      const dtIdle = Math.min((timestamp - (engine.lastTime || timestamp)) / 1000, 0.05);
      engine.lastTime = timestamp;

      if (engine.background && engine.player) {
        engine.background.update(0.4, dtIdle);
        engine.player.idleTimer += dtIdle;
        engine.background.draw(ctx, engine.score ? engine.score.currentLevel.bgTheme : {
          skyGradient: ['#070712', '#151028', '#23153c'],
          mountainColor: '#0f0c1d',
          midgroundColor: '#17132a',
          groundColor: '#100c22',
          groundAccent: '#a855f7',
          moonColor: '#e9d5ff',
          moonGlow: 'rgba(168, 85, 247, 0.4)',
          gridColor: 'rgba(168, 85, 247, 0.15)',
        });
        engine.player.draw(ctx, engine.powerups ? engine.powerups.active : {});
      }
      return;
    }

    // Delta time in seconds, capped to 0.05s to prevent quantum tunneling on tab switch
    const dt = Math.min((timestamp - engine.lastTime) / 1000, 0.05);
    engine.lastTime = timestamp;

    const { player, obstacles, powerups, particles, score, background, groundY } = engine;
    const currentLevel = score.currentLevel;
    const isSpeedBoost = powerups.active.speedBoost;

    // Calculate game movement speed
    const baseSpeed = currentLevel.baseSpeed;
    const gameSpeed = isSpeedBoost ? baseSpeed * 1.55 : baseSpeed;

    // Check buffered jump (Zero-latency responsiveness)
    if (engine.jumpBuffer > 0) {
      engine.jumpBuffer -= dt;
      if (player.isGrounded) {
        player.jump(particles);
        engine.jumpBuffer = 0;
      }
    }

    // 1. Update Game Systems with speed scaling
    background.update(gameSpeed, dt);
    player.update(dt, groundY, particles, powerups.active, gameSpeed);
    powerups.update(dt, gameSpeed, player, particles);
    obstacles.update(dt, timestamp, gameSpeed, currentLevel, groundY, player, powerups.active.magnet);
    particles.update(dt);
    score.update(dt, gameSpeed, isSpeedBoost);

    // Powerup count tracker
    if (isSpeedBoost && !engine.hadSpeedBoost) {
      engine.powerupsUsedCount++;
      engine.hadSpeedBoost = true;
      if (engine.shake) engine.shake.intensity = 5;
    } else if (!isSpeedBoost) {
      engine.hadSpeedBoost = false;
    }

    // 2. Collision Handling
    handleCollisions({
      player,
      obstacleManager: obstacles,
      powerupManager: powerups,
      particleSystem: particles,
      onGameOver: handleGameOver,
      onCoinCollected: () => {
        score.addCoin();
      },
      onShieldSaved: () => {
        if (engine.shake) engine.shake.intensity = 10;
        const ach = storage.unlockAchievement('shield_savior');
        if (ach) showToast('Achievement Unlocked!', ach.title);
      },
    });

    // 3. Render Scene with Dynamic Screen Shake
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (engine.shake && engine.shake.intensity > 0) {
      const shakeX = (Math.random() - 0.5) * engine.shake.intensity * 2;
      const shakeY = (Math.random() - 0.5) * engine.shake.intensity * 2;
      ctx.translate(shakeX, shakeY);
      engine.shake.intensity *= 0.88;
      if (engine.shake.intensity < 0.2) engine.shake.intensity = 0;
    }

    background.draw(ctx, currentLevel.bgTheme);
    obstacles.draw(ctx, currentLevel.bgTheme.groundAccent);
    powerups.draw(ctx);
    player.draw(ctx, powerups.active);
    particles.draw(ctx);
    ctx.restore();

    // 4. Push React state updates cleanly throttled (~100ms interval to eliminate React render overhead)
    if (!engine.lastHudUpdate || timestamp - engine.lastHudUpdate >= 95) {
      engine.lastHudUpdate = timestamp;
      setScoreData({
        distance: Math.floor(score.distance),
        coins: score.coins,
        score: score.score,
        bestScore: score.bestScore,
        level: currentLevel.level,
        levelName: currentLevel.name,
        levelTitle: currentLevel.title,
        multiplier: score.scoreMultiplier,
      });

      setPowerupStatus({
        ...powerups.active,
      });
    }

    // Continue loop
    engine.animationFrameId = requestAnimationFrame(gameLoop);
  }, [handleGameOver, showToast]);

  // Start Playing Game
  const startGame = useCallback(() => {
    initEngine();
    const engine = engineRef.current;
    engine.isRunning = true;
    engine.lastTime = performance.now();
    sound.startBgm();
    sound.updateTempo(1);
    setGameState('PLAYING');

    if (engine.animationFrameId) {
      cancelAnimationFrame(engine.animationFrameId);
    }
    engine.animationFrameId = requestAnimationFrame(gameLoop);
  }, [initEngine, gameLoop]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      engineRef.current.isRunning = false;
      sound.stopBgm();
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      engineRef.current.isRunning = true;
      engineRef.current.lastTime = performance.now();
      sound.startBgm();
      setGameState('PLAYING');
      engineRef.current.animationFrameId = requestAnimationFrame(gameLoop);
    }
  }, [gameState, gameLoop]);

  // Restart Game
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Return to Main Menu
  const goToMenu = useCallback(() => {
    engineRef.current.isRunning = false;
    sound.stopBgm();
    if (engineRef.current.animationFrameId) {
      cancelAnimationFrame(engineRef.current.animationFrameId);
    }
    setGameState('MENU');
  }, []);

  // Change Skin
  const changeSkin = useCallback((skinId) => {
    setSelectedSkin(skinId);
    storage.setSelectedSkin(skinId);
    if (engineRef.current.player) {
      engineRef.current.player.setSkin(skinId);
    }
  }, []);

  // Jump Action with Instant Zero-Latency Input Buffering & Duplicate Event Guard
  // One tap = Jump; Second tap while airborne = 360° Acrobatic Somersault Flip
  const triggerJump = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const now = performance.now();
    // Guard against duplicate synthetic browser touch/click events (< 110ms)
    if (now - lastJumpTimeRef.current < 110) {
      return;
    }
    lastJumpTimeRef.current = now;

    const engine = engineRef.current;
    if (engine.player) {
      const jumped = engine.player.jump(engine.particles);
      if (!jumped && !engine.player.isGrounded && engine.player.canDoubleJump) {
        // Buffer input for 160ms so landing triggers jump on frame 0
        engine.jumpBuffer = 0.16;
      }
    }
  }, [gameState]);

  // Slide Action
  const triggerSlide = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const engine = engineRef.current;
    if (engine.player) {
      engine.player.slide();
    }
  }, [gameState]);

  // Stop Slide
  const triggerStopSlide = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const engine = engineRef.current;
    if (engine.player) {
      engine.player.stopSlide();
    }
  }, [gameState]);

  // Request Landscape Mode / Mobile Screen Rotation
  const requestLandscapeMode = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      }
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape');
      }
      showToast('Screen Mode', 'Rotated to Landscape Mode!', 'Zap');
    } catch {
      showToast('Screen Rotate', 'Please turn on Auto-Rotate on your phone and rotate sideways!', 'Zap');
    }
  }, [showToast]);

  // Keyboard Event Listeners (Space / ArrowUp / W = Jump, ArrowDown / S = Slide)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat && (e.code === 'Space' || e.code === 'ArrowUp')) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          triggerJump();
        } else if (gameState === 'MENU' || gameState === 'GAMEOVER') {
          startGame();
        }
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        triggerSlide();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        togglePause();
      } else if (e.code === 'KeyM') {
        const cur = storage.getSettings();
        const updated = { ...cur, soundEnabled: !cur.soundEnabled, musicEnabled: !cur.soundEnabled };
        storage.saveSettings(updated);
        sound.setSoundEnabled(updated.soundEnabled);
        sound.setMusicEnabled(updated.musicEnabled);
        showToast('Audio Settings', updated.soundEnabled ? 'Sound Unmuted' : 'Sound Muted');
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        triggerStopSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, triggerJump, triggerSlide, triggerStopSlide, togglePause, startGame, showToast]);

  // Multi-phase mobile orientation and viewport resize adaptation
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Full viewport width and height
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;

      const isPort = h > w;
      setIsPortrait(isPort);

      // Detect mobile orientation: Landscape (wide) vs Portrait (tall)
      const isLandscape = !isPort;
      const groundMargin = isLandscape
        ? Math.min(85, Math.max(55, Math.floor(h * 0.18)))
        : Math.min(145, Math.max(90, Math.floor(h * 0.24)));

      const newGroundY = Math.max(130, h - groundMargin);
      const oldGroundY = engineRef.current.groundY || newGroundY;
      const dy = newGroundY - oldGroundY;
      engineRef.current.groundY = newGroundY;

      if (engineRef.current.player) {
        engineRef.current.player.canvasWidth = w;
        engineRef.current.player.canvasHeight = h;
        engineRef.current.player.groundY = newGroundY;
        engineRef.current.player.x = Math.max(50, Math.min(140, Math.floor(w * (isLandscape ? 0.14 : 0.18))));
        if (engineRef.current.player.isGrounded) {
          engineRef.current.player.y = newGroundY - engineRef.current.player.height;
        } else if (oldGroundY > 0 && Math.abs(dy) > 1) {
          engineRef.current.player.y += dy;
        }
      }

      // Synchronously reposition obstacles and powerups when screen rotates
      if (oldGroundY > 0 && Math.abs(dy) > 1) {
        if (engineRef.current.obstacles?.adjustGround) {
          engineRef.current.obstacles.adjustGround(newGroundY, dy);
        }
        if (engineRef.current.powerups?.adjustGround) {
          engineRef.current.powerups.adjustGround(newGroundY, dy);
        }
      }

      if (engineRef.current.background) {
        engineRef.current.background.resize(w, h, newGroundY);
      }
    };

    handleResize();

    // Multi-phase handler for mobile browsers to catch URL bar & orientation calibration
    const onMobileRotate = () => {
      handleResize();
      setTimeout(handleResize, 60);
      setTimeout(handleResize, 180);
      setTimeout(handleResize, 380);
    };

    window.addEventListener('resize', onMobileRotate);
    window.addEventListener('orientationchange', onMobileRotate);

    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', onMobileRotate);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onMobileRotate);
    }

    return () => {
      window.removeEventListener('resize', onMobileRotate);
      window.removeEventListener('orientationchange', onMobileRotate);
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', onMobileRotate);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onMobileRotate);
      }
    };
  }, []);

  // Initial draw on mount
  useEffect(() => {
    initEngine();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && engineRef.current.background) {
        engineRef.current.background.draw(ctx, engineRef.current.score.currentLevel.bgTheme);
        engineRef.current.player.draw(ctx, {});
      }
    }
  }, [initEngine]);

  return {
    canvasRef,
    gameState,
    scoreData,
    powerupStatus,
    selectedSkin,
    toastNotification,
    isNewHighScore,
    isPortrait,
    requestLandscapeMode,
    startGame,
    togglePause,
    restartGame,
    goToMenu,
    changeSkin,
    triggerJump,
    triggerSlide,
    triggerStopSlide,
    showToast,
  };
}
