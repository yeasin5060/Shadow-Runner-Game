// In-Game Heads-Up Display (HUD) for Shadow Runner

import React from 'react';
import { Pause, Coins, Flame, Shield, Zap, Magnet, Volume2, VolumeX, ArrowUp, ArrowDown } from 'lucide-react';
import { sound } from '../game/audio';
import { storage } from '../utils/storage';

export function GameHUD({
  scoreData,
  powerupStatus,
  onPause,
  onJump,
  onSlide,
  onStopSlide,
  showToast,
}) {
  const [isMuted, setIsMuted] = React.useState(!storage.getSettings().soundEnabled);

  const toggleMute = () => {
    const cur = storage.getSettings();
    const updated = { ...cur, soundEnabled: !cur.soundEnabled, musicEnabled: !cur.soundEnabled };
    storage.saveSettings(updated);
    sound.setSoundEnabled(updated.soundEnabled);
    sound.setMusicEnabled(updated.musicEnabled);
    setIsMuted(!updated.soundEnabled);
    showToast?.('Audio', updated.soundEnabled ? 'Unmuted' : 'Muted');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5 md:p-6 z-10 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Left: Distance & Level */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Distance */}
          <div className="glass-panel px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 border border-purple-500/30">
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dist</span>
              <span className="text-base sm:text-2xl font-game font-bold text-white tracking-wider flex items-baseline gap-0.5 sm:gap-1">
                {scoreData.distance} <span className="text-[10px] sm:text-xs text-purple-400 font-sans font-medium">m</span>
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
              <span className="text-xl font-game font-bold text-purple-300">
                {scoreData.score}
              </span>
            </div>
          </div>

          {/* Level Badge */}
          <div className="glass-panel px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 border border-cyan-500/30">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                Lv.{scoreData.level}
              </span>
              <span className="text-[10px] font-semibold text-gray-200 hidden lg:inline">
                {scoreData.levelName}
              </span>
            </div>
          </div>

          {/* Multiplier Badge */}
          {scoreData.multiplier > 1 && (
            <div className="glass-panel px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-yellow-500/50 flex items-center gap-1 animate-bounce">
              <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-game font-bold text-yellow-400 text-xs sm:text-sm">2X</span>
            </div>
          )}
        </div>

        {/* Right: Coins, Audio & Pause */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto shrink-0">
          {/* Coin Counter */}
          <div className="glass-panel px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 border border-yellow-500/30">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-400/20 border border-yellow-400/80 flex items-center justify-center">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />
            </div>
            <span className="text-sm sm:text-lg font-game font-bold text-yellow-300">
              {scoreData.coins}
            </span>
          </div>

          {/* Audio Mute button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass-panel p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-white"
            title="Toggle Mute (M)"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPause();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass-panel p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-gray-300 hover:text-white"
            title="Pause Game (P or Esc)"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Middle: Active Power-up Timers Banner */}
      <div className="flex flex-col items-center gap-1.5 self-center my-auto px-2">
        {/* Shield Active */}
        {powerupStatus.shield && (
          <div className="glass-panel-glow px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-1.5 text-cyan-300 text-[10px] sm:text-xs font-semibold animate-pulse border border-cyan-400/60 shadow-cyan">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 fill-cyan-400/30" />
            <span>SHADOW AEGIS (Shield 1 Hit)</span>
          </div>
        )}

        {/* Magnet Active Timer */}
        {powerupStatus.magnet && (
          <div className="glass-panel px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-2 border border-pink-500/50">
            <Magnet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
            <span className="text-[10px] sm:text-xs font-semibold text-pink-300">ORB MAGNET</span>
            <div className="w-12 sm:w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full transition-all duration-75"
                style={{ width: `${(powerupStatus.magnetTimer / powerupStatus.magnetMax) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Speed Boost Active Timer */}
        {powerupStatus.speedBoost && (
          <div className="glass-panel px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-2 border border-cyan-400/60 shadow-cyan">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 fill-cyan-400/30" />
            <span className="text-[10px] sm:text-xs font-semibold text-cyan-300">SHADOW RUSH</span>
            <div className="w-12 sm:w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-75"
                style={{ width: `${(powerupStatus.speedBoostTimer / powerupStatus.speedBoostMax) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls / Mobile Touch Action Buttons */}
      <div className="flex items-end justify-between w-full pointer-events-auto pb-2 sm:pb-4">
        {/* Left: Slide / Duck Button (Mobile) */}
        <button
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onSlide?.(); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onStopSlide?.(); }}
          onMouseDown={(e) => { e.stopPropagation(); onSlide?.(); }}
          onMouseUp={(e) => { e.stopPropagation(); onStopSlide?.(); }}
          className="glass-panel w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-90 active:bg-cyan-500/30 transition-all border-2 border-cyan-500/50 hover:border-cyan-400 shadow-cyan text-cyan-300"
          title="Slide"
        >
          <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Slide</span>
        </button>

        {/* Controls Hint for Desktop */}
        <div className="hidden md:flex items-center gap-4 text-xs text-gray-400 glass-panel px-4 py-2 rounded-xl pointer-events-none">
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono">CLICK / SPACE</kbd> Jump</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono">2x</kbd> Double Jump</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono">↓ / S</kbd> Slide</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono">P</kbd> Pause</span>
        </div>

        {/* Right: Jump / Double Jump Button (Mobile) */}
        <button
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onJump?.(); }}
          onClick={(e) => { e.stopPropagation(); onJump?.(); }}
          className="glass-panel w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-90 active:bg-purple-500/40 transition-all border-2 border-purple-500/60 hover:border-purple-400 shadow-purple text-purple-300"
          title="Jump / Double Jump"
        >
          <ArrowUp className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="text-xs sm:text-sm font-game font-bold uppercase tracking-wider">Jump</span>
        </button>
      </div>
    </div>
  );
}
