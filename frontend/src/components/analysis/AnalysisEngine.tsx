"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  Upload,
  Database,
  FileText,
  Loader,
  AlertTriangle,
  File as FileIcon,
} from "lucide-react";
import { AnalysisResult, BatchResult, ManualPrediction } from "@/types";
import ResultsDisplay from "./ResultsDisplay";
import BatchResultsDisplay from "./BatchResultsDisplay";
import StellarContext from "../ui/StellarContext";

const BACKEND_URL = "http://127.0.0.1:8000";

// Default manual input values
const defaultManualInput = {
  koi_period: 75.0,
  koi_time0bk: 0.0,
  koi_duration: 4.0,
  koi_depth: 23791.0,
  koi_impact: 0.7,
  koi_model_snr: 10.0,
  koi_prad: 1.0,
  koi_steff: 5778.0,
  koi_srad: 1.0,
  koi_slogg: 4.4,
  koi_score: 0.5,
  koi_pdisposition_bin: 1.2,
};

export default function AnalysisEngine() {
  const [activeTab, setActiveTab] = useState("upload");
  const [starId, setStarId] = useState("Kepler-186");
  const [file, setFile] = useState<File | null>(null);
  const [useDefault, setUseDefault] = useState(true);

  // --- NEW: Manual input state ---
  const [manualInput, setManualInput] = useState(defaultManualInput);
  const [manualPrediction, setManualPrediction] = useState<ManualPrediction | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [singleStarResult, setSingleStarResult] = useState<AnalysisResult["stellarData"] | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);

  // --- Dropzone setup ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUseDefault(false);
      clearResults();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  // --- Helpers ---
  const clearResults = () => {
    setError(null);
    setSingleStarResult(null);
    setBatchResult(null);
    setManualPrediction(null);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // --- Main analysis handler ---
  const handleAnalysis = async () => {
    setIsLoading(true);
    clearResults();

    try {
      if (activeTab === "upload") {
        // --- Upload Tab Logic ---
        let fileToUpload = file;

        if (useDefault || !fileToUpload) {
          const defaultFileResponse = await fetch("/default.csv");
          if (!defaultFileResponse.ok) {
            throw new Error("Failed to load default.csv from public folder.");
          }
          const blob = await defaultFileResponse.blob();
          fileToUpload = new File([blob], "default.csv", { type: "text/csv" });
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);

        const response = await fetch(`${BACKEND_URL}/api/exoplanet-detection-csv`, {
          method: "POST",
          body: formData,
        });

        const resultData = await response.json();
        if (!response.ok) {
          throw new Error(resultData.detail || "File analysis failed.");
        }

        setBatchResult(resultData);

      } else if (activeTab === "star-id") {
        // --- Star ID Logic ---
        if (!starId.trim()) throw new Error("Please enter a Star ID.");

        const response = await fetch(`${BACKEND_URL}/api/star-info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ star_name: starId }),
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to fetch star data.");
        }

        setSingleStarResult(data);

      } else if (activeTab === "manual") {
        // --- Manual Prediction Logic ---
        const response = await fetch(`${BACKEND_URL}/api/predict-single`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(manualInput),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Prediction failed.");
        setManualPrediction(data);
      }

    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(String(err)); // fallback for non-Error throws
  }
} finally {
  setIsLoading(false);
}
  };

  // --- UI Render ---
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

    if (error && activeTab !== "manual") {
      return (
        <div className="min-h-[300px] flex flex-col justify-center items-center text-center">
          <AlertTriangle className="h-12 w-12 text-red-400" />
          <p className="mt-4 text-lg text-red-400">Analysis Failed</p>
          <p className="text-gray-400">{error}</p>
        </div>
      );
    }

    if (batchResult) return <BatchResultsDisplay data={batchResult} />;
    if (singleStarResult)
      return (
        <div className="max-w-md mx-auto">
          <StellarContext stellarData={singleStarResult} />
        </div>
      );

    // --- Default Tab Content ---
    return (
      <div className="min-h-[300px] text-left text-gray-300">
        {/* UPLOAD TAB */}
        {activeTab === "upload" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
              <Upload size={24} /> Upload Data File
            </h3>
            <p className="text-gray-400 mb-4 tracking-wide">
              Upload a CSV with period, impact, and depth columns for batch analysis.
            </p>

            {/* Default / Custom toggle */}
            <div className="mb-4 p-4 bg-gray-900/30 border border-gray-400/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={useDefault}
                  onChange={() => {
                    setUseDefault(true);
                    setFile(null);
                  }}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Use Default Sample Data</p>
                  <p className="text-sm text-gray-400">
                    Quick start with pre-loaded stellar data
                  </p>
                </div>
              </label>
            </div>

            <div className="mb-4 p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="radio"
                  checked={!useDefault}
                  onChange={() => setUseDefault(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Upload Custom File</p>
                  <p className="text-sm text-gray-400">Use your own CSV data</p>
                </div>
              </label>

              {!useDefault && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-gray-400/50 rounded-lg p-8 hover:border-gray-300/70 cursor-pointer text-center transition ${
                    isDragActive ? "border-blue-400" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-300">
                      <FileIcon size={20} />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm">Drop your CSV file here or click to browse</p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleAnalysis}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-500 transition"
            >
              Analyze File <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {/* STAR ID TAB */}
        {activeTab === "star-id" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
              <Database size={24} /> Enter Star ID
            </h3>
            <p className="text-gray-400 mb-4">
              Enter a catalog ID to retrieve contextual data about a star.
            </p>
            <input
              type="text"
              value={starId}
              onChange={(e) => setStarId(e.target.value)}
              placeholder="e.g., Kepler-186"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white mb-4"
            />
            <button
              onClick={handleAnalysis}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-500 transition"
            >
              Retrieve Star Data <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {/* MANUAL TAB */}
        {activeTab === "manual" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
              <FileText size={24} /> Manual Parameter Entry
            </h3>
            <p className="text-gray-400 mb-4">
              Manually enter exoplanet parameters to get a prediction from the model.
            </p>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {Object.entries(defaultManualInput).map(([key]) => (
                <div key={key}>
                  <label
                    className="text-xs text-gray-400 block mb-1 capitalize"
                    title={key}
                  >
                    {key.replace("koi_", "").replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={manualInput[key as keyof typeof manualInput]}
                    onChange={handleManualInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAnalysis}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-lg transition"
            >
              Classify Data Point <ArrowRight size={20} />
            </button>

            {error && (
              <div className="text-center mt-4 text-red-400 p-2 bg-red-900/30 rounded-md">
                <AlertTriangle className="inline mr-2" size={18} />
                {error}
              </div>
            )}

            {manualPrediction && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center bg-gray-900/70 p-6 rounded-lg"
              >
                <p className="text-lg text-gray-400">Model Prediction:</p>
                <p
                  className={`text-3xl font-bold ${
                    manualPrediction.prediction === "CONFIRMED"
                      ? "text-green-400"
                      : manualPrediction.prediction === "CANDIDATE"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {manualPrediction.prediction || "N/A"}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { key: "upload", icon: Upload, label: "Upload Data" },
          { key: "star-id", icon: Database, label: "Star ID" },
          { key: "manual", icon: FileText, label: "Manual Entry" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              clearResults();
              setFile(null);
              if (key === "upload") setUseDefault(true);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === key
                ? "bg-gray-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
      {renderContent()}
    </motion.div>
  );
}
