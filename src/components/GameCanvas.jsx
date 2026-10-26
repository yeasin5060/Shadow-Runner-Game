// Canvas Viewport and Touch Gesture Controller for Shadow Runner

import React, { useRef } from 'react';

export function GameCanvas({
  canvasRef,
  onJump,
  onSlide,
  onStopSlide,
  gameState,
}) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Screen click handler for desktop mouse
  const handleMouseDown = (e) => {
    if (e.button === 0 && gameState === 'PLAYING') {
      onJump?.();
    }
  };

  const handleTouchStart = (e) => {
    if (gameState !== 'PLAYING') return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    if (gameState !== 'PLAYING') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // Swipe Down -> Slide
    if (dy > 40 && Math.abs(dy) > Math.abs(dx)) {
      onSlide?.();
      setTimeout(() => {
        onStopSlide?.();
      }, 500);
      return;
    }

    // Tap or Swipe Up -> Jump
    onJump?.();
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-pointer"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        id="gameCanvas"
        className="block w-full h-full bg-[#06060c]"
      />
    </div>
  );
}
