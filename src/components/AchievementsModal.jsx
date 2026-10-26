// Achievements Modal for Shadow Runner

import React from 'react';
import { Trophy, CheckCircle2, Lock, X, Coins, Footprints, Flame, Crown, Wind, Shield, Zap } from 'lucide-react';
import { ACHIEVEMENTS_LIST, storage } from '../utils/storage';

const ICON_MAP = {
  Footprints,
  Flame,
  Crown,
  Wind,
  Coins,
  Shield,
  Zap,
};

export function AchievementsModal({ onClose }) {
  const [unlockedMap, setUnlockedMap] = React.useState(storage.getAchievements());
  const unlockedCount = Object.keys(unlockedMap).length;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel-glow max-w-lg w-full max-h-[85vh] p-6 sm:p-7 rounded-3xl flex flex-col gap-5 border border-cyan-500/40 shadow-cyan relative animate-scale-up overflow-hidden">
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
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-game font-bold text-white text-glow-cyan">
              Achievements
            </h2>
            <p className="text-xs text-gray-400">
              Completed: <span className="text-cyan-400 font-bold">{unlockedCount}</span> of {ACHIEVEMENTS_LIST.length}
            </p>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = !!unlockedMap[ach.id];
            const IconComponent = ICON_MAP[ach.icon] || Trophy;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'glass-panel border-cyan-500/40 bg-cyan-950/20'
                    : 'glass-panel border-white/5 opacity-60 bg-black/30'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan'
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}
                  >
                    {isUnlocked ? (
                      <IconComponent className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                      {isUnlocked && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{ach.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-game font-bold shrink-0">
                  <Coins className="w-3.5 h-3.5" />
                  +{ach.reward}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
