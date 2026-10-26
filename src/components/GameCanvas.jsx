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
  const isTouchDeviceRef = useRef(false);

  // Screen click handler for desktop mouse (ignores synthetic touch-generated mousedowns)
  const handleMouseDown = (e) => {
    if (isTouchDeviceRef.current) return;
    if (e.button === 0 && gameState === 'PLAYING') {
      onJump?.();
    }
  };

  const handleTouchStart = (e) => {
    isTouchDeviceRef.current = true;
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
    if (dy > 35 && Math.abs(dy) > Math.abs(dx)) {
      onSlide?.();
      setTimeout(() => {
        onStopSlide?.();
      }, 500);
      return;
    }

    // 1st Tap: Athletic Leap Jump | 2nd Tap (airborne): 360° Acrobatic Somersault Flip
    onJump?.();
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-pointer touch-none"
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
