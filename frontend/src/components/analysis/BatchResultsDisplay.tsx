"use client";

import { Check, X, AlertCircle } from 'lucide-react';

// Define a type for the response from your /api/exoplanet-detection-csv endpoint
type BatchResult = {
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
};

interface BatchResultsDisplayProps {
  data: BatchResult;
}

export default function BatchResultsDisplay({ data }: BatchResultsDisplayProps) {
  const { summary, results } = data;

  return (
    <div className="text-left text-gray-300">
      <h3 className="text-2xl font-semibold text-white mb-4">Batch Analysis Complete</h3>
      
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-2xl font-bold">{summary.total_rows_processed}</p><p className="text-sm text-gray-400">Rows Processed</p></div>
        <div className="bg-green-800/50 p-4 rounded-lg"><p className="text-2xl font-bold text-green-300">{summary.exoplanets_found}</p><p className="text-sm text-green-400">Exoplanets Found</p></div>
        <div className="bg-blue-800/50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-300">{summary.non_exoplanets}</p><p className="text-sm text-blue-400">Non-Matches</p></div>
        <div className="bg-red-800/50 p-4 rounded-lg"><p className="text-2xl font-bold text-red-300">{summary.errors}</p><p className="text-sm text-red-400">Errors</p></div>
      </div>

      {/* Detailed Results List */}
      <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
        {results.map((item) => (
          <div key={item.row_number} className="p-3 rounded-lg bg-gray-900/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500 w-8">{`Row ${item.row_number}`}</span>
              {item.is_exoplanet && <Check className="text-green-400" />}
              {!item.is_exoplanet && item.error === undefined && <X className="text-gray-500" />}
              {item.error && <AlertCircle className="text-red-400" />}
              <p>
                {item.is_exoplanet ? `Match Found: ${item.matching_planet?.kepler_name}` : item.error ? `Error: ${item.error}` : 'No exoplanet match found.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}