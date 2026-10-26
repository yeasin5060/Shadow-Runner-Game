// Character Skin Selector and Shop for Shadow Runner

import React from 'react';
import { Shirt, Check, Lock, X, Coins, Sparkles } from 'lucide-react';
import { SKINS_DATA, storage } from '../utils/storage';
import { sound } from '../game/audio';

export function SkinSelector({ selectedSkin, onSelectSkin, onClose, showToast }) {
  const [unlockedSkins, setUnlockedSkins] = React.useState(storage.getUnlockedSkins());
  const [totalCoins, setTotalCoins] = React.useState(storage.getTotalCoins());
  const [activeTab, setActiveTab] = React.useState(selectedSkin);

  const activeSkinData = SKINS_DATA.find((s) => s.id === activeTab) || SKINS_DATA[0];
  const isUnlocked = unlockedSkins.includes(activeTab);
  const isSelected = selectedSkin === activeTab;
  const canAfford = totalCoins >= activeSkinData.price;

  const handleUnlock = (skin) => {
    if (totalCoins < skin.price) {
      showToast?.('Insufficient Coins', `You need ${skin.price - totalCoins} more coins!`, 'Coins');
      return;
    }

    sound.playPowerup();
    storage.addCoins(-skin.price);
    const updated = storage.unlockSkin(skin.id);
    setUnlockedSkins(updated);
    setTotalCoins(storage.getTotalCoins());
    onSelectSkin(skin.id);
    showToast?.('Skin Unlocked!', `${skin.name} is now equipped!`, 'Shirt');
  };

  const handleEquip = (skinId) => {
    sound.playButtonClick();
    onSelectSkin(skinId);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel-glow max-w-xl w-full p-4 sm:p-7 rounded-3xl flex flex-col gap-4 sm:gap-6 border border-purple-500/40 shadow-purple relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white glass-panel hover:bg-white/10 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Balance */}
        <div className="flex items-center justify-between pr-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-game font-bold text-white text-glow-purple">
                Shadow Wardrobe
              </h2>
              <p className="text-xs text-gray-400">Unlock unique silhouettes, trails & energy auras</p>
            </div>
          </div>

          <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-yellow-500/30">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-game font-bold text-yellow-300 text-sm">
              {totalCoins}
            </span>
          </div>
        </div>

        {/* Selected Skin Visual Showcase Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-black/50 via-purple-950/20 to-black/50">
          {/* Animated Mini Preview Canvas / Character Box */}
          <div className="relative w-36 h-36 rounded-2xl flex items-center justify-center border border-white/10 bg-black/60 overflow-hidden shadow-2xl">
            {/* Dynamic Ambient Background Glow */}
            <div
              className="absolute inset-0 opacity-40 blur-xl"
              style={{ background: activeSkinData.color }}
            ></div>

            {/* Ninja Character Silhouette Graphic */}
            <div className="relative flex flex-col items-center animate-float">
              {/* Head with glowing visor */}
              <div
                className="w-8 h-8 rounded-full bg-[#0b0c14] border flex items-center justify-center relative shadow-lg"
                style={{ borderColor: activeSkinData.color }}
              >
                <div
                  className="w-4 h-1.5 rounded-sm"
                  style={{ backgroundColor: activeSkinData.accent, boxShadow: `0 0 10px ${activeSkinData.accent}` }}
                ></div>
              </div>
              {/* Scarf */}
              <div
                className="w-10 h-3 rounded-full -mt-1 shadow-md"
                style={{ backgroundColor: activeSkinData.color }}
              ></div>
              {/* Torso */}
              <div className="w-8 h-10 bg-[#0f0f1c] rounded-md mt-0.5 border border-white/10 flex items-center justify-center">
                <div
                  className="w-5 h-0.5"
                  style={{ backgroundColor: activeSkinData.color }}
                ></div>
              </div>
              {/* Legs */}
              <div className="flex gap-2 -mt-0.5">
                <div className="w-2.5 h-6 bg-[#07070e] rounded-b-sm"></div>
                <div
                  className="w-2.5 h-6 bg-[#161626] rounded-b-sm border-t"
                  style={{ borderColor: activeSkinData.color }}
                ></div>
              </div>
            </div>
          </div>

          {/* Skin Details & Actions */}
          <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-game font-bold text-white">{activeSkinData.name}</h3>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: activeSkinData.accent }}
                >
                  {activeSkinData.badge}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">{activeSkinData.desc}</p>
            </div>

            {/* Action Button */}
            <div className="mt-2">
              {isSelected ? (
                <div className="py-2.5 px-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Currently Equipped
                </div>
              ) : isUnlocked ? (
                <button
                  onClick={() => handleEquip(activeSkinData.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-game font-bold text-xs uppercase tracking-wider shadow-purple active:scale-95 transition-all"
                >
                  Equip Skin
                </button>
              ) : (
                <button
                  onClick={() => handleUnlock(activeSkinData)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 px-4 rounded-xl font-game font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    canAfford
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 text-black shadow-gold active:scale-95'
                      : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Unlock for {activeSkinData.price} Coins
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SKINS_DATA.map((skin) => {
            const unlocked = unlockedSkins.includes(skin.id);
            const active = activeTab === skin.id;

            return (
              <button
                key={skin.id}
                onClick={() => {
                  sound.playButtonClick();
                  setActiveTab(skin.id);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all relative ${
                  active
                    ? 'glass-panel-glow border-purple-400 scale-[1.03] shadow-purple'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                {/* Active check indicator */}
                {selectedSkin === skin.id && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: `${skin.color}33`, borderColor: skin.color, borderWidth: 1 }}
                >
                  <Shirt className="w-4 h-4" style={{ color: skin.accent }} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate">{skin.name}</h4>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {unlocked ? (
                      <span className="text-cyan-400">Owned</span>
                    ) : (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {skin.price}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
