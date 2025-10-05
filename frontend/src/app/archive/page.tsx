"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";
import { SparklesCore } from "@/components/ui/Sparkles";
import CosmicBackground from "@/components/ui/CosmicBackground";
import localFont from "next/font/local";
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

const MissionCard = ({ 
  name, 
  years, 
  description, 
  imageUrl, 
  imageAlt,
  index 
}: { 
  name: string;
  years: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true, amount: 0.2 }}
    className="bg-black/40 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20"
  >
    <div className="flex flex-col md:flex-row items-stretch">
<div className="relative w-full md:w-2/5 aspect-[4/3] bg-black/20 flex items-center justify-center">
  <img
    src={imageUrl}
    alt={imageAlt}
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>
      <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-bold italic text-blue-400 mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-400 mb-4 font-medium">{years}</p>
        <p className="text-gray-300 leading-relaxed tracking-wide text-base">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default function ArchivePage() {
  const missions = [
    {
      name: "The Voyager Program",
      years: "1977 – Present",
      description: "Voyager 1 and 2 are NASA's grandest explorers. After a 'Grand Tour' of the outer planets—Jupiter, Saturn, Uranus, and Neptune—they continued their journey outward. Both spacecraft have now entered interstellar space, the region between stars, sending back unprecedented data about the heliosphere and beyond. Each carries a Golden Record, a message in a bottle for any intelligent life that might find them.",
      imageUrl: "https://science.nasa.gov/wp-content/uploads/2024/04/spacecraft-profile.jpg",
      imageAlt: "Artist's impression of a Voyager spacecraft in interstellar space"
    },
    {
      name: "The James Webb Space Telescope (JWST)",
      years: "2021 – Present",
      description: "JWST is the most powerful space telescope ever built. While not exclusively an exoplanet hunter, its infrared sensitivity allows it to peer back to the dawn of time and analyze the atmospheres of distant worlds. It searches for water, methane, and other potential biosignatures, bringing us closer than ever to answering the question: 'Are we alone?'",
      imageUrl: "/backgrounds/jwt.jpg",
      imageAlt: "The James Webb Space Telescope with its golden mirrors"
    },
    {
      name: "The Kepler Space Telescope",
      years: "2009 – 2018",
      description: "Kepler was a game-changer for exoplanet science. By staring at a single patch of sky, it used the transit method to find thousands of planet candidates. It proved that planets are common in our galaxy and revealed a stunning diversity of worlds, from rocky super-Earths to gas giants orbiting close to their stars.",
      imageUrl: "https://images-assets.nasa.gov/image/PIA18904/PIA18904~large.jpg?w=1920&h=1536&fit=clip&crop=faces%2Cfocalpoint",
      imageAlt: "The Kepler Space Telescope in orbit"
    },
{
  name: "SpaceX Falcon Program",
  years: "2008 – Present",
  description:
    "The Falcon program marked the dawn of a new era in spaceflight. With the Falcon 1’s historic first orbit in 2008 and the Falcon 9’s unprecedented reusability breakthroughs, SpaceX redefined what was possible in commercial space travel. Its boosters routinely land and fly again, slashing launch costs and making space more accessible than ever. From resupplying the ISS to launching deep-space missions, Falcon rockets have become the backbone of modern space exploration.",
  imageUrl:
    "/backgrounds/spacex.jpg",
  imageAlt: "Falcon 9 rocket lifting off from Cape Canaveral under a blue sky",
},
    {
      name: "Transiting Exoplanet Survey Satellite (TESS)",
      years: "2018 – Present",
      description: "TESS took Kepler's mission and expanded it to the entire sky. Instead of one spot, TESS scans different sectors, searching for exoplanets around the nearest and brightest stars. These worlds are prime targets for follow-up observations by telescopes like James Webb to study their atmospheres.",
      imageUrl: "https://science.nasa.gov/wp-content/uploads/2023/06/tessinspacerender16by9-jpg.webp?w=1024",
      imageAlt: "Artist's impression of the TESS satellite"
    },
    {
      name: "The Hubble Space Telescope",
      years: "1990 – Present",
      description: "Arguably the most famous scientific instrument ever built, Hubble has fundamentally changed our view of the cosmos. Its iconic images, from the Pillars of Creation to the Hubble Deep Field, have become cultural touchstones. Hubble's discoveries helped determine the age of the universe and proved the existence of supermassive black holes at the center of galaxies.",
      imageUrl: "https://science.nasa.gov/wp-content/uploads/2023/04/hubble_sts_31_launch_s31-s-064-jpg.webp?resize=897,900",
      imageAlt: "The Hubble Space Telescope in orbit above Earth"
    },
  ];

  return (
    <main className={`${myFontNormal.className} min-h-screen w-full overflow-x-hidden`}>
      <div className="fixed inset-0 bg-black -z-10">
        <MemoSparkles />
      </div>
      <Header2 />

      <div className="min-h-screen w-full pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6">
            A Legacy of Discovery
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A brief history of the pioneering NASA missions that revealed the secrets of our solar system and the universe beyond.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          {missions.map((mission, index) => (
            <MissionCard
              key={mission.name}
              {...mission}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          <p>Continuing the journey of exploration and discovery</p>
        </motion.div>
      </div>
    </main>
  );
}