import AnalysisEngine from "@/components/analysis/AnalysisEngine";
import CosmicBackground from "@/components/ui/CosmicBackground";
import Image from "next/image";
import { SparklesCore } from "@/components/ui/Sparkles";
import { memo } from "react";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Header2 from "@/components/layout/Header2";

export const myFontNormal = localFont({
  src: "../../assets/normal.ttf",
  variable: "--font-normal",
  display: "swap",
});

const MemoSparkles = memo(() => (
  <SparklesCore
    id="tsparticlesfullpage"
    background="transparent"
    minSize={0.6}
    maxSize={1.4}
    particleDensity={50}
    className="w-full h-full"
    particleColor="#FFFFFF"
    speed={1}
  />
));
MemoSparkles.displayName = "MemoSparkles";

export default function AnalysisPage() {
  return (
    <main className={`${myFontNormal.className} leading-wide min-h-screen w-full overflow-x-hidden`}>
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10">
        <CosmicBackground />
        <MemoSparkles />
        <div className="hidden sm:block inset-0 pointer-events-none overflow-hidden">
          <Image
            src="/backgrounds/earth.png"
            alt="Large Planet"
            className="absolute z-0 top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/4 opacity-75"
            width={180}
            height={180}
            aria-hidden="true"
          />
          <Image
            src="/backgrounds/saturn.png"
            alt="Saturn-like Planet"
            className="absolute z-0 top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 opacity-75"
            width={220}
            height={220}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen w-full">
        <Header2 />
        {/* Header Section */}
        <header className="w-full mt-16 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-white/70 uppercase px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                Advanced Analytics
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Analysis Engine
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Harness the power of data-driven insights to transform your decision-making process
            </p>
          </div>
        </header>

        {/* Main Content Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Content Card Wrapper */}
            <div className="relative">
              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-2xl blur-xl opacity-50"></div>
              
              {/* Main content card */}
              <div className="relative bg-black/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Glass morphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                
                {/* Content */}
                <div className="relative p-4 sm:p-6 lg:p-8">
                  <AnalysisEngine />
                </div>
              </div>
            </div>

            {/* Optional: Feature highlights */}
            {/* Feature highlights for "A World Away" */}
<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
  <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 text-center">
    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">Real-time Exploration</div>
    <p className="text-xs sm:text-sm text-white/70">Live planetary data and environmental monitoring</p>
  </div>
  <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 text-center">
    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">AI-Powered Analysis</div>
    <p className="text-xs sm:text-sm text-white/70">Intelligent insights on space phenomena</p>
  </div>
  <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 text-center">
    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">Collaborative Discovery</div>
    <p className="text-xs sm:text-sm text-white/70">Team-driven solutions for space challenges</p>
  </div>
</div>
          </div>
        </section>
      </div>
    </main>
  );
}