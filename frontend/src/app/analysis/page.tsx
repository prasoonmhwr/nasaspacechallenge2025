import AnalysisEngine from "@/components/analysis/AnalysisEngine";
import CosmicBackground from "@/components/ui/CosmicBackground";
import Image from "next/image";
import localFont from "next/font/local";
import { SparklesCore } from "@/components/ui/Sparkles";
import { memo } from "react";



const MemoSparkles = memo(() => (
  <SparklesCore
    id="tsparticlesfullpage"
    background="transparent"
    minSize={0.6}
    maxSize={1.4}
    particleDensity={50}
    className="w-1/2 h-1/2"
    particleColor="#FFFFFF"
    speed={1}
  />
));
MemoSparkles.displayName = "MemoSparkles";


export default function AnalysisPage() {
  return (
    <main className={`leading-wide min-h-screen w-full`}>
      <div className="fixed inset-0 -z-10">
        <CosmicBackground />
        <MemoSparkles/>
        <div className="hidden sm:block inset-0 pointer-events-none overflow-hidden">
          <Image
            src="/backgrounds/earth.png"
            alt="Large Planet"
            className="absolute z-0 top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/7 opacity-75"
            width={180}
            height={180}
          />
          <Image
            src="/backgrounds/saturn.png"
            alt="Saturn-like Planet"
            className="absolute z-0 top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 opacity-75"
            width={220}
            height={220}
          />
        </div>
      </div>

      <div className="min-h-screen w-full bg-black/10 flex items-center justify-center pt-32 pb-12">
        <AnalysisEngine />
      </div>
    </main>
  );
}