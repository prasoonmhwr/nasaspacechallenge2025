"use client";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Logo from "../ui/Logo";

export default function Header() {
  return (
    <motion.header
      className="fixed top-4 left-4 right-4 z-50 backdrop-blur-sm bg-black/20 border border-white/10 rounded-2xl shadow-2xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
          <Logo />
          <h1 className="text-white text-xl">OrbitAI</h1>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8 text-xl font-medium">
          {["Discover", "How It Works", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              {item}
            </a>
          ))}
        </nav>

        <motion.a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-400/30 transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 146, 60, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Github size={18} />
          <span className="hidden sm:inline text-sm font-medium">Source</span>
        </motion.a>
      </div>
    </motion.header>
  );
}
