// In frontend/src/components/TransitAnimation.tsx

"use client";

import { animate } from 'animejs';
import { useEffect, useId } from 'react';

interface TransitAnimationProps {
  orbitalPeriod: number;
  impact: number;
  depth: number;
  starRadius?: number;
  starColor?: string;
}

export default function TransitAnimation({
  orbitalPeriod = 365,
  impact = 0,
  depth = 1000,
  starRadius = 1,
  starColor = '#FFFDE7',
}: TransitAnimationProps) {
  
  const uniqueId = useId();

  const starDiameter = 150;

  const planetStarRadiusRatio = Math.sqrt(depth / 1_000_000);
  const planetDiameter = Math.max(5, starDiameter * planetStarRadiusRatio);

  const orbitDiameter = starDiameter * 1.5;
  const verticalOffset = impact * (starDiameter / 2);

  const animationDuration = orbitalPeriod * 50;
  
  useEffect(() => {
    animate({
      targets: `#orbit-${uniqueId}`,
      rotate: '360deg',
      duration: animationDuration,
      easing: 'linear',
      loop: true,
      //@ts-expect-error idk man it works
    }, []);
  }, [animationDuration, uniqueId]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: `${orbitDiameter}px`, height: `${orbitDiameter}px` }}
      >
        {/* The Star */}
        <div 
          className="rounded-full shadow-lg"
          style={{ width: `${starDiameter}px`, height: `${starDiameter}px`, backgroundColor: starColor, boxShadow: `0 0 ${starDiameter / 2}px ${starColor}`, zIndex: 1 }}
        />
        
        <div 
          id={`orbit-${uniqueId}`}
          className="absolute border-2 border-dashed border-gray-700 rounded-full"
          style={{ 
            width: `${orbitDiameter}px`, 
            height: `${orbitDiameter}px`,
            transform: `translateY(${verticalOffset}px)`,
          }}
        >
          {/* The Planet */}
          <div 
            className="absolute top-1/2 rounded-full bg-blue-400 -translate-y-1/2"
            style={{ width: `${planetDiameter}px`, height: `${planetDiameter}px`, left: `-${planetDiameter / 2}px`, zIndex: 2 }}
          />
        </div>
      </div>
    </div>
  );
}