"use client";

import { motion } from 'framer-motion';
import { PlanetResult } from './ResultsList';
import TransitAnimation from './TransitAnimation';

interface PlanetDetailViewProps {
  planet: PlanetResult | null;
}

export default function PlanetDetailView({ planet }: PlanetDetailViewProps) {
  if (!planet) {
    return (
      <div className="h-full flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 text-gray-400">
        <p className="text-xl">Select a candidate from the list to view details.</p>
      </div>
    );
  }

  const animationProps = {
    planetRadius: planet.koi_prad,
    orbitalPeriod: planet.koi_period,
    impact: planet.koi_impact,
    depth: planet.koi_depth, 
    starRadius: 1,
    starColor: '#FFFDE7',
  };

  return (
    <div className="h-full bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h3 className="text-3xl font-bold font-italic text-center text-blue-400">{planet.kepler_name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <TransitAnimation {...animationProps} />
          </div>
          <div className="text-center md:text-left space-y-2">
            <p><strong>Status:</strong> {planet.koi_disposition}</p>
            <p><strong>Confidence Score:</strong> {planet.koi_score}</p>
            <p><strong>Orbital Period:</strong> {planet.koi_period.toFixed(2)} days</p>
            <p><strong>Planet Radius:</strong> {planet.koi_prad} (x Earth)</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}