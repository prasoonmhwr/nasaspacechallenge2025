"use client";
import { motion } from "framer-motion";

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
              <p className="text-lg leading-relaxed"> <span className="text-gray-400 font-semibold">A World Away</span> is an AI/ML-powered exoplanet detection system built for the NASA Space Apps Challenge. Our model is trained on open-source datasets from NASAs Kepler, K2, and TESS missions to identify potential exoplanets in stellar light curves. </p> <p className="leading-relaxed"> The system analyzes critical parameters including orbital period, transit duration, planetary radius, and transit depth to classify data points as confirmed exoplanets, planetary candidates, or false positives. Each variable contributes uniquely to the final classification, and our preprocessing pipeline ensures maximum model accuracy. </p> <p className="leading-relaxed"> Scientists and researchers can interact with the model through three methods: uploading their own light curve data files, entering star catalog IDs to retrieve NASA mission data, or manually inputting parameters for analysis. User-provided data can optionally be used to continuously improve and update the models predictions. </p>
            </div>
          </motion.div>
          <div className="mt-8">
          </div>
          </section>
  );
}
