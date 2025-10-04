"use client";

import Background from "@/components/layout/Background";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import About from "@/components/sections/About";
import localFont from "next/font/local";

export const myFontNormal = localFont({
  src: "../assets/normal.ttf",
  variable: "--font-normal",
  display: "swap",
});

export default function Home() {
  return (
    <main className={`${myFontNormal.className} font-sans leading-wide min-h-screen w-full relative`}>
      <Background />
      <div className="min-h-screen w-full bg-black/10">
        <Header />
        <Hero />
        <HowItWorks />
        <About />
        <Footer />
      </div>
    </main>
  );
}
