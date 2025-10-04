"use client";
import { AnalysisResult } from "@/types";
import TransitAnimation from "./TransitAnimation";
import StellarContext from "../ui/StellarContext";

interface ResultsDisplayProps { result: AnalysisResult; }

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getClassificationColor = () => { /* Switch statement for color */ };
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold font-italic ${getClassificationColor()}`}>{result.classification}</h2>
        <p className="text-xl text-gray-300">Confidence Score: {result.confidence}%</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
          <TransitAnimation planetData={result.planetData} stellarData={result.stellarData} />
        </div>
        <div className="space-y-8">
          <StellarContext stellarData={result.stellarData} />
        </div>
      </div>
    </div>
  );
}