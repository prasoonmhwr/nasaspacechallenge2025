"use client";

import { useState, useEffect } from 'react';
import ResultsList, { PlanetResult } from './ResultsList';
import PlanetDetailView from './PlanetDetailView';

export default function AnalysisDashboard() {
  const [results, setResults] = useState<PlanetResult[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/result.json')
      .then(response => response.json())
      .then((data: PlanetResult[]) => {
        setResults(data);
        setSelectedPlanet(data[0]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p className="text-center text-xl">Loading analysis results...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ minHeight: '600px' }}>
      <div className="md:col-span-1">
        <ResultsList 
          results={results} 
          onPlanetSelect={setSelectedPlanet} 
          selectedPlanetName={selectedPlanet?.kepler_name || null}
        />
      </div>
      <div className="md:col-span-2">
        <PlanetDetailView planet={selectedPlanet} />
      </div>
    </div>
  );
}