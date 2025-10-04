"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div className="mb-6 mt-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-300 backdrop-blur-sm">
          NASA Space Apps Challenge 2025
        </span>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-white">WeBuild presents,</span> <br />
        <span className="text-gray-500 bg-clip-text">Discover Exoplanets : A World Away</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Our AI/ML model analyzes NASA telescope data from Kepler, K2, and TESS missions to identify
        new exoplanets. Upload light curve data or enter a star ID to begin your discovery.
      </motion.p>

      <Link href="/analysis">
        <motion.button
          className="px-8 py-4 text-lg font-semibold rounded-full bg-gray-600 text-white shadow-lg shadow-white/50 transition-all duration-300 mb-18"
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px #FFFFFF" }}
          whileTap={{ scale: 0.95 }}
        >
          Start Discovering Exoplanets
        </motion.button>
      </Link>

      <Image
        src="/backgrounds/figure.png"
        alt="Figure"
        className="absolute z-0 bottom-0 mb-0 opacity-75 pointer-events-none"
        width={220}
        height={220}
      />
    </section>
  );
}
