// Shadow Runner Game - Main Application Container

import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { PauseMenu } from './components/PauseMenu';
import { GameOver } from './components/GameOver';
import { DailyChallenges } from './components/DailyChallenges';
import { AchievementsModal } from './components/AchievementsModal';
import { SkinSelector } from './components/SkinSelector';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Settings } from './components/Settings';
import { Sparkles, Trophy, Award, Shirt, Zap, Shield, Flame, Coins } from 'lucide-react';

const TOAST_ICONS = {
  Award,
  Trophy,
  Shirt,
  Zap,
  Shield,
  Flame,
  Coins,
};

export default function App() {
  const {
    canvasRef,
    gameState,
    scoreData,
    powerupStatus,
    selectedSkin,
    toastNotification,
    isNewHighScore,
    isPortrait,
    requestLandscapeMode,
    startGame,
    togglePause,
    restartGame,
    goToMenu,
    changeSkin,
    triggerJump,
    triggerSlide,
    triggerStopSlide,
    showToast,
  } = useGameEngine();

  // Modals state
  const [modalState, setModalState] = useState(null); // 'SKINS' | 'DAILY' | 'ACHIEVEMENTS' | 'LEADERBOARD' | 'SETTINGS' | null

  const closeModal = () => setModalState(null);

  return (
    <main className="relative w-full h-full min-h-[100dvh] overflow-hidden bg-[#06060c] select-none font-sans text-gray-100">
      {/* 1. Underlying Canvas */}
      <GameCanvas
        canvasRef={canvasRef}
        onJump={triggerJump}
        onSlide={triggerSlide}
        onStopSlide={triggerStopSlide}
        gameState={gameState}
      />

      {/* 2. Floating Toast Notification */}
      {toastNotification && (
        <aside
          aria-label="Notification"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 glass-panel-glow px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-cyan-400 shadow-cyan animate-bounce"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            {React.createElement(TOAST_ICONS[toastNotification.icon] || Sparkles, {
              className: 'w-4 h-4',
            })}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              {toastNotification.title}
            </span>
            <span className="text-xs font-semibold text-white">
              {toastNotification.message}
            </span>
          </div>
        </aside>
      )}

      {/* 3. Main Menu View */}
      {gameState === 'MENU' && (
        <MainMenu
          onStart={startGame}
          onOpenSkins={() => setModalState('SKINS')}
          onOpenDaily={() => setModalState('DAILY')}
          onOpenAchievements={() => setModalState('ACHIEVEMENTS')}
          onOpenLeaderboard={() => setModalState('LEADERBOARD')}
          onOpenSettings={() => setModalState('SETTINGS')}
          isPortrait={isPortrait}
          onRotate={requestLandscapeMode}
        />
      )}

      {/* 4. Active Gameplay HUD */}
      {gameState === 'PLAYING' && (
        <GameHUD
          scoreData={scoreData}
          powerupStatus={powerupStatus}
          onPause={togglePause}
          onJump={triggerJump}
          onSlide={triggerSlide}
          onStopSlide={triggerStopSlide}
          showToast={showToast}
          isPortrait={isPortrait}
          onRotate={requestLandscapeMode}
        />
      )}

      {/* 5. Pause Menu */}
      {gameState === 'PAUSED' && (
        <PauseMenu
          onResume={togglePause}
          onRestart={restartGame}
          onMainMenu={goToMenu}
        />
      )}

      {/* 6. Game Over View */}
      {gameState === 'GAMEOVER' && (
        <GameOver
          scoreData={scoreData}
          isNewHighScore={isNewHighScore}
          onRestart={restartGame}
          onMainMenu={goToMenu}
          onOpenSkins={() => setModalState('SKINS')}
        />
      )}

      {/* 7. Dialog Modals */}
      {modalState === 'DAILY' && (
        <DailyChallenges
          onClose={closeModal}
          onClaimReward={(amount) => {
            showToast('Reward Claimed!', `+${amount} Shadow Orbs added to your bank!`, 'Coins');
          }}
        />
      )}

      {modalState === 'ACHIEVEMENTS' && (
        <AchievementsModal onClose={closeModal} />
      )}

      {modalState === 'SKINS' && (
        <SkinSelector
          selectedSkin={selectedSkin}
          onSelectSkin={changeSkin}
          onClose={closeModal}
          showToast={showToast}
        />
      )}

      {modalState === 'LEADERBOARD' && (
        <LeaderboardModal onClose={closeModal} />
      )}

      {modalState === 'SETTINGS' && (
        <Settings onClose={closeModal} />
      )}
    </main>
  );
}
