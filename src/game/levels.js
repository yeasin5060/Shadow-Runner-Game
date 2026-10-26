// Levels & Difficulty Configuration for Shadow Runner

export const LEVELS = [
  {
    level: 1,
    name: 'Beginner',
    title: 'Twilight Forest',
    minDistance: 0,
    maxDistance: 300,
    baseSpeed: 5.8,
    obstacleIntervalMin: 1400, // ms between spawns
    obstacleIntervalMax: 2200,
    coinSpawnChance: 0.65,
    powerupSpawnChance: 0.12,
    allowedObstacles: ['stone', 'crate'],
    bgTheme: {
      skyGradient: ['#070712', '#151028', '#23153c'],
      mountainColor: '#0f0c1d',
      midgroundColor: '#17132a',
      groundColor: '#100c22',
      groundAccent: '#a855f7',
      moonColor: '#e9d5ff',
      moonGlow: 'rgba(168, 85, 247, 0.4)',
      gridColor: 'rgba(168, 85, 247, 0.15)',
    }
  },
  {
    level: 2,
    name: 'Intermediate',
    title: 'Neon Metropolis',
    minDistance: 300,
    maxDistance: 800,
    baseSpeed: 7.5,
    obstacleIntervalMin: 1100,
    obstacleIntervalMax: 1800,
    coinSpawnChance: 0.75,
    powerupSpawnChance: 0.18,
    allowedObstacles: ['stone', 'crate', 'spikes', 'drone'],
    bgTheme: {
      skyGradient: ['#040a16', '#091c30', '#0a2a44'],
      mountainColor: '#051424',
      midgroundColor: '#0b263e',
      groundColor: '#071828',
      groundAccent: '#00f5ff',
      moonColor: '#a5f3fc',
      moonGlow: 'rgba(0, 245, 255, 0.4)',
      gridColor: 'rgba(0, 245, 255, 0.18)',
    }
  },
  {
    level: 3,
    name: 'Advanced',
    title: 'Crimson Citadel',
    minDistance: 800,
    maxDistance: 1500,
    baseSpeed: 9.2,
    obstacleIntervalMin: 900,
    obstacleIntervalMax: 1500,
    coinSpawnChance: 0.8,
    powerupSpawnChance: 0.22,
    allowedObstacles: ['crate', 'spikes', 'laser', 'drone'],
    bgTheme: {
      skyGradient: ['#120408', '#2d0912', '#440f1a'],
      mountainColor: '#20070e',
      midgroundColor: '#320b16',
      groundColor: '#1a050b',
      groundAccent: '#ef4444',
      moonColor: '#fca5a5',
      moonGlow: 'rgba(239, 68, 68, 0.45)',
      gridColor: 'rgba(239, 68, 68, 0.2)',
    }
  },
  {
    level: 4,
    name: 'Shadow Master',
    title: 'Abyssal Void',
    minDistance: 1500,
    maxDistance: Infinity,
    baseSpeed: 11.2,
    obstacleIntervalMin: 750,
    obstacleIntervalMax: 1250,
    coinSpawnChance: 0.85,
    powerupSpawnChance: 0.25,
    allowedObstacles: ['stone', 'crate', 'spikes', 'laser', 'drone'],
    bgTheme: {
      skyGradient: ['#080410', '#180728', '#2b0b42'],
      mountainColor: '#120420',
      midgroundColor: '#220838',
      groundColor: '#0d0317',
      groundAccent: '#eab308',
      moonColor: '#fde047',
      moonGlow: 'rgba(234, 179, 8, 0.5)',
      gridColor: 'rgba(234, 179, 8, 0.25)',
    }
  }
];

export function getLevelForDistance(distance) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (distance >= LEVELS[i].minDistance) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}
