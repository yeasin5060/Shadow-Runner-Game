import React from 'react';
import { Play, Shirt, Calendar, Trophy, Award, Settings as SettingsIcon, Coins, Sparkles, RotateCw } from 'lucide-react';
import { storage } from '../utils/storage';
import { sound } from '../game/audio';

export function MainMenu({
  onStart,
  onOpenSkins,
  onOpenDaily,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenSettings,
  isPortrait,
  onRotate,
}) {
  const [bestScore] = React.useState(storage.getBestScore());
  const [totalCoins] = React.useState(storage.getTotalCoins());
  const [daily] = React.useState(storage.getDailyChallenge());
  const hasDailyReward = daily.completed && !daily.claimed;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-6 md:p-10 select-none pointer-events-auto overflow-y-auto pb-[max(12px,env(safe-area-inset-bottom))]">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-purple shrink-0">
            <div className="w-full h-full bg-[#0d0c18] rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-purple-400 tracking-widest uppercase">Version 1.0</span>
            <div className="text-[11px] sm:text-xs font-semibold text-gray-300">Shadow Protocol</div>
          </div>
        </div>

        {/* Rotate Button & User Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rotate to Landscape Button */}
          <button
            onClick={() => {
              sound.playButtonClick();
              onRotate?.();
            }}
            className="glass-panel p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5"
            title="Rotate to Landscape Mode"
          >
            <RotateCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Rotate</span>
          </button>
          {/* Best Score */}
          <div className="glass-panel px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2.5 border border-purple-500/30">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-gray-400 tracking-wider">Best</span>
              <span className="text-xs sm:text-sm font-game font-bold text-purple-300">{bestScore}</span>
            </div>
          </div>

          {/* Coins */}
          <div className="glass-panel px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2.5 border border-yellow-500/30">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-gray-400 tracking-wider">Orbs</span>
              <span className="text-xs sm:text-sm font-game font-bold text-yellow-300">{totalCoins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="flex flex-col items-center text-center my-auto py-4 sm:py-8 gap-4 sm:gap-8 max-w-xl mx-auto w-full">
        {/* Game Title */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-game font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
            CYBER SHADOW ENDLESS RUNNER
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-game font-black tracking-wider text-white text-glow-purple drop-shadow-2xl">
            SHADOW<span className="text-cyan-400 text-glow-cyan">RUNNER</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-md font-normal leading-relaxed px-2">
            Dodge lethal spikes, leap across chasms with double jumps, and harness cosmic power-ups in an endless sprint.
          </p>
        </div>

        {/* Start Game Big CTA Button */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-xs px-4">
          <button
            onClick={() => {
              sound.playButtonClick();
              onStart();
            }}
            className="w-full py-3.5 sm:py-5 px-6 sm:px-8 rounded-2xl font-game font-black text-base sm:text-xl uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black shadow-cyan active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse-glow"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black" />
            START SPRINT
          </button>
          <span className="text-[11px] sm:text-xs text-gray-400 tracking-wider">
            Tap screen or Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-200">SPACE</kbd>
          </span>
        </div>
      </div>

      {/* Bottom Menu Navigation Bar */}
      <div className="glass-panel max-w-lg w-full mx-auto p-1.5 sm:p-2.5 rounded-2xl grid grid-cols-5 sm:flex sm:justify-around border border-white/10 shadow-2xl">
        {/* Skins Shop */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onOpenSkins();
          }}
          className="flex flex-col items-center gap-1 py-1.5 px-1 sm:py-2 sm:px-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-cyan-300"
        >
          <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Skins</span>
        </button>

        {/* Daily Mission */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onOpenDaily();
          }}
          className="relative flex flex-col items-center gap-1 py-1.5 px-1 sm:py-2 sm:px-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-purple-300"
        >
          {hasDailyReward && (
            <span className="absolute top-1 right-2 sm:right-3 w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
          )}
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Daily</span>
        </button>

        {/* Achievements */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onOpenAchievements();
          }}
          className="flex flex-col items-center gap-1 py-1.5 px-1 sm:py-2 sm:px-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-cyan-300"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Trophies</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onOpenLeaderboard();
          }}
          className="flex flex-col items-center gap-1 py-1.5 px-1 sm:py-2 sm:px-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-yellow-300"
        >
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Ranks</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onOpenSettings();
          }}
          className="flex flex-col items-center gap-1 py-1.5 px-1 sm:py-2 sm:px-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-white"
        >
          <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </div>
    </div>
  );
}
