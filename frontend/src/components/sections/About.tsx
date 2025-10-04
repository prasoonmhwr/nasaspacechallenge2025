"use client";
import { motion } from "framer-motion";
import StellarContext from "../ui/StellarContext";

export default function About() {
  return (
    <section id="about" className="container mx-auto px-6 py-10">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-8">
          About the Project
        </h2>
        <div className="bg-black/40 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-8 space-y-6 text-gray-300">
          <p>
            <span className="text-gray-400 font-semibold">A World Away</span> is an AI/ML-powered
            exoplanet detection system built for the NASA Space Apps Challenge. It analyzes light
            curve data from NASA’s Kepler, K2, and TESS missions.
          </p>
          <p>
            The system extracts orbital period, transit duration, and planetary radius to classify
            stars as confirmed exoplanets, candidates, or false positives.
          </p>
          <p>
            Researchers can upload data, enter star IDs, or manually input parameters. Each user
            interaction helps refine the model for future discoveries.
          </p>
        </div>
      </motion.div>

      <div className="mt-8">
        <StellarContext />
      </div>
    </section>
  );
}
