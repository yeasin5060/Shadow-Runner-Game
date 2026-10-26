// Daily Challenge Modal for Shadow Runner

import React from 'react';
import { Calendar, CheckCircle2, Gift, X, Sparkles, Coins } from 'lucide-react';
import { storage } from '../utils/storage';
import { sound } from '../game/audio';

export function DailyChallenges({ onClose, onClaimReward }) {
  const [challenge, setChallenge] = React.useState(storage.getDailyChallenge());
  const [totalCoins, setTotalCoins] = React.useState(storage.getTotalCoins());

  const handleClaim = () => {
    sound.playPowerup();
    const reward = storage.claimDailyReward();
    if (reward > 0) {
      setChallenge(storage.getDailyChallenge());
      setTotalCoins(storage.getTotalCoins());
      onClaimReward?.(reward);
    }
  };

  const progressPercent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel-glow max-w-md w-full p-4 sm:p-7 rounded-3xl flex flex-col gap-4 sm:gap-5 border border-purple-500/40 shadow-purple relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white glass-panel hover:bg-white/10 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-game font-bold text-white text-glow-purple">
              Daily Mission
            </h2>
            <p className="text-xs text-gray-400">Resets every 24 hours at midnight</p>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Today's Target</span>
              <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
              <p className="text-xs text-gray-300 mt-1">{challenge.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs font-bold shrink-0">
              <Coins className="w-3.5 h-3.5 fill-yellow-400" />
              +{challenge.reward}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-gray-400">Progress</span>
              <span className="text-purple-300 font-game">{challenge.progress} / {challenge.target}</span>
            </div>
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Claim or Status Action */}
          {challenge.claimed ? (
            <div className="py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Reward Claimed!
            </div>
          ) : challenge.completed ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-game font-bold text-sm uppercase tracking-wider shadow-gold active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse-glow"
            >
              <Gift className="w-5 h-5 fill-black" />
              Claim {challenge.reward} Coins
            </button>
          ) : (
            <div className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-center text-xs">
              Complete the objective in any run today to unlock reward
            </div>
          )}
        </div>

        {/* User Bank */}
        <div className="flex items-center justify-between px-3 text-xs text-gray-400">
          <span>Your Bank Balance:</span>
          <span className="font-game font-bold text-yellow-400 flex items-center gap-1.5 text-sm">
            <Coins className="w-4 h-4 fill-yellow-400" />
            {totalCoins}
          </span>
        </div>
      </div>
    </div>
  );
}
