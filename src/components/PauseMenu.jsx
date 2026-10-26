// Pause Menu Overlay for Shadow Runner

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio';
import { storage } from '../utils/storage';

export function PauseMenu({ onResume, onRestart, onMainMenu }) {
  const [settings, setSettings] = React.useState(storage.getSettings());

  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled, musicEnabled: !settings.soundEnabled };
    storage.saveSettings(updated);
    setSettings(updated);
    sound.setSoundEnabled(updated.soundEnabled);
    sound.setMusicEnabled(updated.musicEnabled);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-sm w-full p-5 sm:p-8 rounded-3xl flex flex-col items-center text-center gap-4 sm:gap-6 border border-cyan-500/40 shadow-2xl animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase font-game font-semibold tracking-widest text-cyan-400">Game Paused</span>
          <h2 className="text-3xl sm:text-4xl font-game font-black text-white text-glow-cyan tracking-wider">
            STASIS
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {/* Resume Button */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-xl font-game font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-black" />
            Resume Run
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-xl font-game font-semibold text-sm uppercase tracking-wider glass-panel hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-gray-200 border border-white/15"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            Restart Run
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider glass-panel hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-gray-300 border border-white/10"
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Sound: Enabled
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                Sound: Muted
              </>
            )}
          </button>

          {/* Main Menu Button */}
          <button
            onClick={onMainMenu}
            className="w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider glass-panel hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-red-300 border border-red-500/30"
          >
            <Home className="w-4 h-4 text-red-400" />
            Quit to Main Menu
          </button>
        </div>

        <p className="text-[11px] text-gray-400 tracking-wider">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-200">P</kbd> or <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-200">ESC</kbd> to resume
        </p>
      </div>
    </div>
  );
}
