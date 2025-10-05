"use client";
import { motion } from 'framer-motion';

export type PlanetResult = {
    kepler_name: string;
    koi_disposition: "CONFIRMED" | "FALSE POSITIVE";
    koi_score: number;
    koi_period: number;
    koi_prad: number;
    koi_impact: number;
    koi_depth: number;
};

interface ResultsListsProps {
    results: PlanetResult[];
    onPlanetSelect: (planet: PlanetResult) => void;
    selectedPlanetName: string | null;
}

export default function ResultsLists({ results, onPlanetSelect, selectedPlanetName}: ResultsListsProps) {
    return (
        <div className='h-full bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4'>
            <h3 className='text-xl font-bold font-italic text-gray-400 mb-4'>Analysis Results ({results.length})</h3>
            <div className='space-y-2 overflow-y-auto h-[500px] pr-2'>
            {results.map((planet) => (
          <motion.div
            key={planet.kepler_name}
            onClick={() => onPlanetSelect(planet)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedPlanetName === planet.kepler_name ? 'bg-blue-600/50' : 'hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.02 }}
            layout
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{planet.kepler_name}</span>
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  planet.koi_disposition === 'CONFIRMED' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {planet.koi_disposition}
              </span>
            </div>
            <p className="text-sm text-gray-400">Confidence: {planet.koi_score}</p>
          </motion.div>
        ))}
            </div>
        </div>
    );
}