"use client";

import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Large striped planet (left)
      const planet1X = centerX - 250;
      const planet1Y = centerY - 150;
      const planet1Radius = 65;

      // Small moon near planet 1
      const moon1X = planet1X - 35;
      const moon1Y = planet1Y + 45;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(moon1X, moon1Y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Top right small
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX + 320, centerY - 220, 18, 0, Math.PI * 2);
      ctx.fill();

      // Right side striped small
      ctx.beginPath();
      ctx.arc(centerX + 380, centerY - 90, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + 358, centerY - 90 + i * 7);
        ctx.lineTo(centerX + 402, centerY - 90 + i * 7 - 5);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(centerX - 350, centerY - 60, 10, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{ background: '#000000' }}
    />
  );
};

export default CosmicBackground;