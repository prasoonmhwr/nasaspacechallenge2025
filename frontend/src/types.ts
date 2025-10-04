// In frontend/src/types.ts

// Type for a single, detailed analysis result
export interface AnalysisResult {
  classification: "Planetary Candidate" | "Confirmed Exoplanet" | "False Positive";
  confidence: number;
  stellarData: {
    name: string;
    imageUrl: string;
    spectralType: string | null;
    numberOfStars: string;
    numberOfPlanets: string;
    distance: string;
    constellation: string;
    starRadius: number;
  };
  planetData: {
    orbitalPeriod: number;
    planetRadius: number;
    impact: number;
    depth: number;
  };
}

export interface BatchResult {
  summary: {
    total_rows_processed: number;
    exoplanets_found: number;
    non_exoplanets: number;
    errors: number;
  };
  results: Array<{
    is_exoplanet?: boolean;
    matching_planet?: {
      kepler_name: string;
    };
    error?: string;
    row_number: number;
  }>;
}