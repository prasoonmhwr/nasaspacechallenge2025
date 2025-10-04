"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sun, Globe, Compass, Star } from 'lucide-react';

// The type is now imported from a central types file for consistency
import { AnalysisResult } from '@/types';

// The component now only accepts the data it needs to display as a prop
interface StellarContextProps {
  stellarData: AnalysisResult['stellarData'];
}

export default function StellarContext({ stellarData }: StellarContextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-blue-400/50">
        <Image
          src={stellarData.imageUrl}
          alt={`Sky survey image of ${stellarData.name}`}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <h4 className="text-2xl font-bold font-italic text-center text-blue-400">{stellarData.name}</h4>
      <div className="mt-4 space-y-3 text-left text-sm">
        <div className="flex items-center gap-3"><Sun size={20} className="text-yellow-400"/><span>System has <strong>{stellarData.numberOfStars} star(s)</strong></span></div>
        <div className="flex items-center gap-3"><Globe size={20} className="text-green-400"/><span><strong>{stellarData.numberOfPlanets}</strong> confirmed planet(s)</span></div>
        <div className="flex items-center gap-3"><Compass size={20} className="text-teal-400"/><span>In the <strong>{stellarData.constellation}</strong> constellation</span></div>
        <div className="flex items-center gap-3"><Star size={20} className="text-purple-400"/><span>Distance: <strong>{stellarData.distance}</strong></span></div>
      </div>
    </motion.div>
  );
}