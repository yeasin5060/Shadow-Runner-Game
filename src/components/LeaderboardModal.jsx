// Leaderboard Modal for Shadow Runner

import React from 'react';
import { Award, Trophy, Medal, X } from 'lucide-react';
import { storage } from '../utils/storage';

export function LeaderboardModal({ onClose }) {
  const [leaderboard] = React.useState(storage.getLeaderboard());

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 flex items-center justify-center">
            <Trophy className="w-4 h-4 fill-yellow-400" />
          </div>
        );
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-gray-400/20 border border-gray-300 text-gray-200 flex items-center justify-center">
            <Medal className="w-4 h-4 fill-gray-300" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-700/20 border border-amber-600 text-amber-500 flex items-center justify-center">
            <Medal className="w-4 h-4 fill-amber-600" />
          </div>
        );
      default:
        return (
          <span className="font-game font-bold text-gray-400 text-xs w-7 text-center">
            #{index + 1}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel-glow max-w-lg w-full p-4 sm:p-7 rounded-3xl flex flex-col gap-4 sm:gap-5 border border-yellow-500/40 shadow-gold relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white glass-panel hover:bg-white/10 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-game font-bold text-white text-glow-gold">
              Hall of Shadows
            </h2>
            <p className="text-xs text-gray-400">Top runners across the shadow realm</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <span className="col-span-2">Rank</span>
            <span className="col-span-5">Runner</span>
            <span className="col-span-3 text-right">Distance</span>
            <span className="col-span-2 text-right">Score</span>
          </div>

          <div className="divide-y divide-white/5 max-h-[50vh] overflow-y-auto">
            {leaderboard.map((entry, idx) => {
              const isPlayer = entry.name === 'You';

              return (
                <div
                  key={entry.id || idx}
                  className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-all ${
                    isPlayer
                      ? 'bg-purple-900/30 text-purple-200 font-semibold'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="col-span-2 flex items-center">
                    {getRankBadge(idx)}
                  </div>
                  <div className="col-span-5 font-bold flex items-center gap-2 truncate">
                    <span className={isPlayer ? 'text-purple-300 font-game' : 'text-white'}>
                      {entry.name}
                    </span>
                    {isPlayer && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/30 text-purple-300 font-sans uppercase">
                        You
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-right text-gray-400 font-sans">
                    {entry.distance}m
                  </div>
                  <div className="col-span-2 text-right font-game font-bold text-yellow-400">
                    {entry.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
