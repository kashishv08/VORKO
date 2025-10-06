"use client";
import { useTheme } from "@/src/components/context/ThemeContext";
import Features from "./Features";
import Footer from "./Footer";
import { Hero } from "./Hero";
import { BlurryDynamicTechBg } from "./BlurryDynamicTechBg";

// MAIN LANDING PAGE
export default function VORKOLanding() {
  const { darkMode } = useTheme();

  return (
    <BlurryDynamicTechBg>
      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          color: darkMode ? "#fff" : "#1c2233",
          fontFamily: "Inter, sans-serif",
          transition: "background 0.3s",
          position: "relative",
        }}
      >
        <Hero />
        <Features />
        <Footer />
      </div>
    </BlurryDynamicTechBg>
  );
}
