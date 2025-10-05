"use client";
import { memo } from "react";
import Image from "next/image";
import CosmicBackground from "../ui/CosmicBackground";
import { SparklesCore } from "../ui/Sparkles";

const Background = memo(() => (
  <div className="fixed inset-0 -z-10 bg-black/30">
    <CosmicBackground />
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
    <div className="hidden sm:block inset-0 pointer-events-none overflow-hidden">
      <Image
        src="/backgrounds/earth.png"
        alt="Planet"
        className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/7 opacity-75"
        width={180}
        height={180}
      />
      <Image
        src="/backgrounds/saturn.png"
        alt="Saturn"
        className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 opacity-75"
        width={220}
        height={220}
      />
    </div>
  </div>
));
Background.displayName = "Background";
export default Background;
