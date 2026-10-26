// Settings Modal for Shadow Runner

import React from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Sparkles, X, Music, Keyboard } from 'lucide-react';
import { storage } from '../utils/storage';
import { sound } from '../game/audio';

export function Settings({ onClose }) {
  const [settings, setSettings] = React.useState(storage.getSettings());

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    storage.saveSettings(updated);
    setSettings(updated);
    sound.setSoundEnabled(updated.soundEnabled);
  };

  const handleToggleMusic = () => {
    const updated = { ...settings, musicEnabled: !settings.musicEnabled };
    storage.saveSettings(updated);
    setSettings(updated);
    sound.setMusicEnabled(updated.musicEnabled);
  };

  const handleToggleQuality = () => {
    const updated = {
      ...settings,
      particlesQuality: settings.particlesQuality === 'high' ? 'low' : 'high',
    };
    storage.saveSettings(updated);
    setSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel-glow max-w-md w-full p-4 sm:p-7 rounded-3xl flex flex-col gap-4 sm:gap-6 border border-cyan-500/40 shadow-cyan relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white glass-panel hover:bg-white/10 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-game font-bold text-white text-glow-cyan">
              Configuration
            </h2>
            <p className="text-xs text-gray-400">Sound, visuals & keybindings</p>
          </div>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {/* Sound Effects Toggle */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sound Effects (SFX)</h4>
                <p className="text-xs text-gray-400">Jump, coins, hits & abilities</p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Synth Music Toggle */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cyber Synth BGM</h4>
                <p className="text-xs text-gray-400">Tempo accelerates with level speed</p>
              </div>
            </div>
            <button
              onClick={handleToggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.musicEnabled ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Visual Particle FX */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Particle Quality</h4>
                <p className="text-xs text-gray-400">Shockwaves, dust & trails</p>
              </div>
            </div>
            <button
              onClick={handleToggleQuality}
              className="px-3 py-1 rounded-lg text-xs font-game font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-cyan-500/30 hover:bg-white/15"
            >
              {settings.particlesQuality}
            </button>
          </div>
        </div>

        {/* Controls Guide */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <Keyboard className="w-4 h-4 text-purple-400" />
            Quick Controls
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200">SPACE / ↑</kbd> Jump</div>
            <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200">2x Tap</kbd> Double Jump</div>
            <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200">↓ / S</kbd> Slide / Duck</div>
            <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200">P / ESC</kbd> Pause</div>
          </div>
        </div>
      </div>
    </div>
  );
}
