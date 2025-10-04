"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, Loader } from 'lucide-react';

type StarData = {
  name: string;
  imageUrl: string;
  spectralType: string | null;
  numberOfStars: string;
  numberOfPlanets: string;
  distance: string;
  constellation: string;
};

export default function StellarContext() {
  const [starId, setStarId] = useState<string>("Kepler-186");
  const [starData, setStarData] = useState<StarData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setStarData(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/star-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ star_name: starId }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Star not found.");
      setStarData(data);
    } catch (err: unknown) { //holy copilot
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center'>
    <div className="w-1/2 h-full p-4 bg-black/30 backdrop-blur-sm rounded-2xl border tracking-wider border-gray-700/50">
      <h3 className="text-xl font-bold font-italic mb-4 text-gray-400">Discover your Stars</h3>
      <div className="flex items-center gap-2">
        <input
          type="text" value={starId} onChange={(e) => setStarId(e.target.value)}
          placeholder="Enter Star ID (e.g., Kepler-186)"
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={handleSearch} disabled={loading}
          className="bg-gray-600 hover:bg-gray-500 text-white font-semibold p-3 rounded-lg disabled:bg-gray-500 transition"
        >
          {loading ? <Loader className="animate-spin" /> : <Search />}
        </button>
      </div>

      <AnimatePresence>
        {loading && <motion.div className="text-center mt-4 text-gray-300">Querying NASA`s Archives...</motion.div>}
        {error && <motion.div className="text-center mt-4 text-red-400">Error: {error}</motion.div>}
        {starData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-900/70 rounded-lg border border-gray-700"
          >
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-400/50">
              
              <Image
                src={starData.imageUrl}
                alt={`Sky survey image of ${starData.name}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <h4 className="text-2xl font-bold font-italic text-center text-gray-400">{starData.name}</h4>
            <div className="mt-4 space-y-3 text-left text-sm">
              <div className="flex items-center gap-3"><span>System has <strong>{starData.numberOfStars} star(s)</strong></span></div>
              <div className="flex items-center gap-3"><span><strong>{starData.numberOfPlanets}</strong> confirmed planet(s)</span></div>
              <div className="flex items-center gap-3"><span>In the <strong>{starData.constellation}</strong> constellation</span></div>
              <div className="flex items-center gap-3"><span>Distance: <strong>{starData.distance}</strong></span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}