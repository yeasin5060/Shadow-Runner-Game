// Storage helper for Shadow Runner Game

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  particlesQuality: 'high', // 'low' | 'high'
};

const DEFAULT_SKINS = ['ninja']; // 'ninja' is free default

const DEFAULT_LEADERBOARD = [
  { id: '1', name: 'ShadowKage', score: 3840, distance: 3420, date: '2026-10-24' },
  { id: '2', name: 'NeonPhantom', score: 2950, distance: 2600, date: '2026-10-25' },
  { id: '3', name: 'NightStalker', score: 2180, distance: 1980, date: '2026-10-25' },
  { id: '4', name: 'CyberVoid', score: 1640, distance: 1510, date: '2026-10-26' },
  { id: '5', name: 'BladeRunner', score: 1120, distance: 990, date: '2026-10-26' },
];

export const ACHIEVEMENTS_LIST = [
  { id: 'first_run', title: 'First Shadow Step', desc: 'Complete your first run', reward: 50, icon: 'Footprints' },
  { id: 'reach_500m', title: 'Shadow Apprentice', desc: 'Reach 500m in a single run', reward: 100, icon: 'Flame' },
  { id: 'reach_1500m', title: 'Shadow Master', desc: 'Reach 1500m & conquer Level 4', reward: 300, icon: 'Crown' },
  { id: 'double_jumper', title: 'Sky Walker', desc: 'Perform 20 double jumps in one game', reward: 100, icon: 'Wind' },
  { id: 'coin_hoarder', title: 'Golden Shadow', desc: 'Collect 100 coins in total', reward: 150, icon: 'Coins' },
  { id: 'shield_savior', title: 'Iron Will', desc: 'Absorb a fatal hit using your Shield', reward: 120, icon: 'Shield' },
  { id: 'speed_demon', title: 'Sonic Rift', desc: 'Use Speed Boost power-up 3 times', reward: 150, icon: 'Zap' },
];

export const SKINS_DATA = [
  {
    id: 'ninja',
    name: 'Shadow Shinobi',
    desc: 'The stealth master clad in midnight silk and violet mist.',
    price: 0,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    trailColor: 'rgba(168, 85, 247, 0.4)',
    accent: '#c084fc',
    badge: 'Classic'
  },
  {
    id: 'cyber',
    name: 'Neon Phantom',
    desc: 'Augmented cyber-runner powered by hyper-charged turquoise energy.',
    price: 250,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    trailColor: 'rgba(6, 182, 212, 0.4)',
    accent: '#22d3ee',
    badge: 'Cyber'
  },
  {
    id: 'specter',
    name: 'Crimson Specter',
    desc: 'A fiery demon shadow that leaves scorched embers with each jump.',
    price: 500,
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    trailColor: 'rgba(239, 68, 68, 0.4)',
    accent: '#f87171',
    badge: 'Infernal'
  },
  {
    id: 'gold',
    name: 'Solar Sovereign',
    desc: 'Legendary shadow forged in pure solar gold and divine light.',
    price: 1000,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.9)',
    trailColor: 'rgba(234, 179, 8, 0.5)',
    accent: '#fde047',
    badge: 'Mythic'
  }
];

export const storage = {
  getBestScore: () => {
    try {
      return parseInt(localStorage.getItem('shadow_runner_best_score') || '0', 10);
    } catch {
      return 0;
    }
  },
  setBestScore: (score) => {
    try {
      localStorage.setItem('shadow_runner_best_score', score.toString());
    } catch (e) {
      console.error(e);
    }
  },

  getTotalCoins: () => {
    try {
      return parseInt(localStorage.getItem('shadow_runner_total_coins') || '0', 10);
    } catch {
      return 0;
    }
  },
  addCoins: (amount) => {
    try {
      const current = storage.getTotalCoins();
      const updated = Math.max(0, current + amount);
      localStorage.setItem('shadow_runner_total_coins', updated.toString());
      return updated;
    } catch {
      return 0;
    }
  },

  getUnlockedSkins: () => {
    try {
      const raw = localStorage.getItem('shadow_runner_unlocked_skins');
      return raw ? JSON.parse(raw) : DEFAULT_SKINS;
    } catch {
      return DEFAULT_SKINS;
    }
  },
  unlockSkin: (skinId) => {
    try {
      const unlocked = storage.getUnlockedSkins();
      if (!unlocked.includes(skinId)) {
        unlocked.push(skinId);
        localStorage.setItem('shadow_runner_unlocked_skins', JSON.stringify(unlocked));
      }
      return unlocked;
    } catch {
      return DEFAULT_SKINS;
    }
  },

  getSelectedSkin: () => {
    try {
      return localStorage.getItem('shadow_runner_selected_skin') || 'ninja';
    } catch {
      return 'ninja';
    }
  },
  setSelectedSkin: (skinId) => {
    try {
      localStorage.setItem('shadow_runner_selected_skin', skinId);
    } catch (e) {
      console.error(e);
    }
  },

  getSettings: () => {
    try {
      const raw = localStorage.getItem('shadow_runner_settings');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (settings) => {
    try {
      localStorage.setItem('shadow_runner_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getAchievements: () => {
    try {
      const raw = localStorage.getItem('shadow_runner_achievements');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },
  unlockAchievement: (id) => {
    try {
      const all = storage.getAchievements();
      if (!all[id]) {
        all[id] = { unlockedAt: new Date().toISOString() };
        localStorage.setItem('shadow_runner_achievements', JSON.stringify(all));
        const item = ACHIEVEMENTS_LIST.find((a) => a.id === id);
        if (item) {
          storage.addCoins(item.reward);
        }
        return item;
      }
      return null;
    } catch {
      return null;
    }
  },

  getDailyChallenge: () => {
    const today = new Date().toISOString().slice(0, 10);
    const pool = [
      { id: 'daily_distance', title: 'Distance Dash', desc: 'Reach 600m in any single run today', target: 600, reward: 150, type: 'distance' },
      { id: 'daily_coins', title: 'Orb Harvester', desc: 'Collect 40 coins today', target: 40, reward: 120, type: 'coins' },
      { id: 'daily_jumps', title: 'Acrobatics', desc: 'Perform 25 double jumps today', target: 25, reward: 100, type: 'doubleJumps' },
      { id: 'daily_powerups', title: 'Overdrive', desc: 'Collect 4 power-ups today', target: 4, reward: 140, type: 'powerups' },
    ];
    // Deterministic index for the date
    const dayIndex = today.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0) % pool.length;
    const challengeTemplate = pool[dayIndex];

    try {
      const raw = localStorage.getItem('shadow_runner_daily_challenge');
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.date === today && saved.id === challengeTemplate.id) {
        return saved;
      }
      const fresh = {
        ...challengeTemplate,
        date: today,
        progress: 0,
        completed: false,
        claimed: false
      };
      localStorage.setItem('shadow_runner_daily_challenge', JSON.stringify(fresh));
      return fresh;
    } catch {
      return { ...challengeTemplate, date: today, progress: 0, completed: false, claimed: false };
    }
  },
  updateDailyChallenge: (incrementType, amount = 1) => {
    try {
      const challenge = storage.getDailyChallenge();
      if (challenge.completed) return challenge;

      if (challenge.type === incrementType) {
        if (incrementType === 'distance') {
          challenge.progress = Math.max(challenge.progress, amount);
        } else {
          challenge.progress += amount;
        }

        if (challenge.progress >= challenge.target) {
          challenge.progress = challenge.target;
          challenge.completed = true;
        }
        localStorage.setItem('shadow_runner_daily_challenge', JSON.stringify(challenge));
      }
      return challenge;
    } catch {
      return null;
    }
  },
  claimDailyReward: () => {
    try {
      const challenge = storage.getDailyChallenge();
      if (challenge.completed && !challenge.claimed) {
        challenge.claimed = true;
        storage.addCoins(challenge.reward);
        localStorage.setItem('shadow_runner_daily_challenge', JSON.stringify(challenge));
        return challenge.reward;
      }
      return 0;
    } catch {
      return 0;
    }
  },

  getLeaderboard: () => {
    try {
      const raw = localStorage.getItem('shadow_runner_leaderboard');
      return raw ? JSON.parse(raw) : DEFAULT_LEADERBOARD;
    } catch {
      return DEFAULT_LEADERBOARD;
    }
  },
  saveLeaderboardScore: (name, score, distance) => {
    try {
      const current = storage.getLeaderboard();
      const newEntry = {
        id: Date.now().toString(),
        name: name || 'Player',
        score: Math.round(score),
        distance: Math.round(distance),
        date: new Date().toISOString().slice(0, 10),
      };
      const updated = [...current, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      localStorage.setItem('shadow_runner_leaderboard', JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_LEADERBOARD;
    }
  }
};
