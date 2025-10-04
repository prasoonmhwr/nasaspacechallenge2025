"use client";
import { motion } from "framer-motion";
import { Upload, Sparkles, Telescope } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container mx-auto px-6 py-34">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white">How It Works</h1>
        <p className="text-gray-400 mt-2 text-lg">Advanced machine learning meets discovery</p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        {[
          {
            icon: Upload,
            title: "1. Provide Data",
            desc: "Upload light curve data, enter a star ID, or manually input parameters.",
          },
          {
            icon: Sparkles,
            title: "2. AI Analysis",
            desc: "Our neural network analyzes orbital and transit features to detect exoplanets.",
          },
          {
            icon: Telescope,
            title: "3. Discovery Dossier",
            desc: "Receive a detailed report with classification and confidence scores.",
          },
        ].map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={i}
            className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-500/20 hover:border-gray-400/40 transition"
            variants={itemVariants}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gray-800/80 p-4 rounded-full border border-gray-600/50">
                <Icon className="text-gray-400" size={28} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-gray-300">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
