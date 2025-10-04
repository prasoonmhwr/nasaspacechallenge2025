"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Upload, Database, FileText, Loader, AlertTriangle, File as FileIcon } from "lucide-react";
import { AnalysisResult, BatchResult } from "@/types";
import ResultsDisplay from "./ResultsDisplay";
import BatchResultsDisplay from "./BatchResultsDisplay";

// Mock fallback (will only be used if API fails)
const MOCK_SINGLE_RESULT: AnalysisResult = {
  classification: "Planetary Candidate",
  confidence: 98.2,
  stellarData: { name: "Kepler-186", imageUrl: "https://skyview.gsfc.nasa.gov/current/cgi/getjpeg.pl?position=299.866,49.863&survey=DSS&size=0.25&pixels=300", spectralType: "M1V", numberOfStars: "1", numberOfPlanets: "5", distance: "582.12 parsecs", constellation: "Cygnus", starRadius: 0.52 },
  planetData: { orbitalPeriod: 129.9, planetRadius: 1.17, impact: 0.2, depth: 150.0 },
};

export default function AnalysisEngine() {
  const [activeTab, setActiveTab] = useState("upload");
  const [starId, setStarId] = useState("Kepler-186");
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<AnalysisResult | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSingleResult(null); setBatchResult(null); setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false });

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setSingleResult(null);
    setBatchResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (activeTab === 'upload') {
        if (!file) throw new Error("Please select a CSV file to upload.");

        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://127.0.0.1:8000/api/exoplanet-detection-csv', {
          method: 'POST', body: formData,
        });
        const resultData = await response.json();
        if (!response.ok) throw new Error(resultData.detail || "File analysis failed.");
        setBatchResult(resultData);

      } else if (activeTab === 'star-id') {
        if (!starId.trim()) throw new Error("Please enter a Star ID.");

        // Fetch real data from backend
        const response = await fetch("http://127.0.0.1:8000/api/star-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ star_name: starId })
        });
        const data = await response.json();
        if (!response.ok || data.error) throw new Error(data.error || "Failed to fetch star data.");

        // Convert backend response to AnalysisResult
        const analysisResult: AnalysisResult = {
          classification: "Planetary Candidate",
          confidence: 98,
          stellarData: data,
          planetData: { orbitalPeriod: 0, planetRadius: 0, impact: 0, depth: 0 },
        };
        setSingleResult(analysisResult);
      }

    } catch (err: any) {
      setError(err.message);
      // fallback to mock if API fails
      if (activeTab === 'star-id') setSingleResult(MOCK_SINGLE_RESULT);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[300px] flex flex-col justify-center items-center text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-400" />
          <p className="mt-4 text-lg">Contacting Deep Space Network...</p>
          <p className="text-gray-400">Our AI is analyzing the stellar data.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-[300px] flex flex-col justify-center items-center text-center">
          <AlertTriangle className="h-12 w-12 text-red-400" />
          <p className="mt-4 text-lg text-red-400">Analysis Failed</p>
          <p className="text-gray-400">{error}</p>
        </div>
      );
    }

    if (singleResult) { return <ResultsDisplay result={singleResult} />; }
    if (batchResult) { return <BatchResultsDisplay data={batchResult} />; }

    return (
      <div className="min-h-[300px] text-left text-gray-300">
        {activeTab === "upload" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2"><Upload size={24} /> Upload Data File</h3>
            <p className="text-gray-400 mb-4">Upload a CSV with `period`, `impact`, and `depth` columns for batch analysis.</p>
            <div {...getRootProps()} className={`border-2 border-dashed border-gray-400/50 rounded-lg p-12 hover:border-gray-300/70 cursor-pointer text-center transition ${isDragActive ? 'bg-blue-900/50 border-blue-400' : ''}`}>
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-lg text-green-300"><FileIcon size={20} /><span>{file.name}</span></div>
              ) : (<p>Drop your CSV file here or click to browse</p>)}
            </div>
            <button onClick={handleAnalysis} disabled={!file} className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-500 transition disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">
              Analyze File <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {activeTab === "star-id" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2"><Database size={24} /> Enter Star ID</h3>
            <p className="text-gray-400 mb-4">Enter a catalog ID to retrieve and analyze its data.</p>
            <input type="text" value={starId} onChange={(e) => setStarId(e.target.value)} placeholder="e.g., Kepler-186" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white mb-4"/>
            <button onClick={handleAnalysis} className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-500 transition">
              Retrieve & Analyze Data <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {activeTab === "manual" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
              <FileText size={24} /> Manual Data Entry
            </h3>
            <p className="text-gray-400 mb-4">
              Manually enter exoplanet parameters for analysis
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                { label: "Orbital Period (days)", placeholder: "365.25" },
                { label: "Transit Duration (hours)", placeholder: "6.5" },
                { label: "Planetary Radius (Earth radii)", placeholder: "1.0" },
                { label: "Transit Depth (ppm)", placeholder: "84" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input
                    type="number"
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-500 transition">
              Classify Data Point <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div className="w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[ { key: "upload", icon: Upload, label: "Upload Data" }, { key: "star-id", icon: Database, label: "Star ID" }, { key: "manual", icon: FileText, label: "Manual Entry" }].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSingleResult(null); setBatchResult(null); setError(null); setFile(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === key ? "bg-gray-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
          >
            <Icon size={20} />{label}
          </button>
        ))}
      </div>
      {renderContent()}
    </motion.div>
  );
}
