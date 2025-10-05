"use client";

import { Check, HelpCircle, X, AlertCircle } from 'lucide-react';
import { BatchResult } from '@/types';

interface BatchResultsDisplayProps { data: BatchResult; }

export default function BatchResultsDisplay({ data }: BatchResultsDisplayProps) {
  const { summary, results } = data;

  const getPredictionStyle = (prediction?: string) => {
    switch (prediction) {
      case "CONFIRMED":
        return { icon: <Check className="text-green-400" />, text: "Exoplanet (Confirmed)", color: "text-green-300" };
      case "CANDIDATE":
        return { icon: <HelpCircle className="text-yellow-400" />, text: "Planetary Candidate", color: "text-yellow-300" };
      case "FALSE POSITIVE":
        return { icon: <X className="text-red-400" />, text: "False Positive", color: "text-red-300" };
      default:
        return { icon: <X className="text-gray-500" />, text: "Not an Exoplanet", color: "text-gray-400" };
    }
  };

  return (
    <div className="text-left text-gray-300">
      <h3 className="text-2xl font-semibold text-white mb-4">Batch Analysis Complete</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-2xl font-bold">{summary.total_rows_processed}</p><p className="text-sm text-gray-400">Rows Processed</p></div>
        <div className="bg-green-800/50 p-4 rounded-lg"><p className="text-2xl font-bold text-green-300">{summary.exoplanets_found}</p><p className="text-sm text-green-400">Exoplanets Found</p></div>
        <div className="bg-red-800/50 p-4 rounded-lg"><p className="text-2xl font-bold text-red-300">{summary.errors}</p><p className="text-sm text-red-400">Errors</p></div>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
        {results.map((item) => {
          const { icon, text, color } = getPredictionStyle(item.prediction);
          return (
            <div key={item.row_number} className="p-3 rounded-lg bg-gray-900/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-500 w-8">{`Row ${item.row_number}`}</span>
                {item.error ? (
                  <>
                    <AlertCircle className="text-red-400" />
                    <p>Error: <span className="font-semibold text-red-300">{item.error}</span></p>
                  </>
                ) : (
                  <>
                    {icon}
                    <p>Classification: <span className={`font-bold ${color}`}>{text}</span></p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}