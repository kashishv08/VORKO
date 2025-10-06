"use client";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "../context/ThemeContext";
import React from "react";
import hero_image from "../../hero_image.json";

function HeroGlassText({ darkMode }) {
  // Define your accent colors
  const gradient = darkMode
    ? "linear-gradient(90deg, #5fd0ff 0%, #906cff 100%)"
    : "linear-gradient(90deg, #2396ef 0%, #58ffd5 100%)";
  const sparkle = darkMode ? "#84eeee" : "#00b5d6";
  const accent1 = darkMode ? "#5fd0ff" : "#239be6";
  const accentSub = darkMode ? "#b3f5ff" : "#209eb3";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: "540px",
        gap: "1.05rem",
        background: "transparent",
        border: "none",
        padding: 0,
        position: "relative",
      }}
    >
      {/* Main Gradient Animated Slogan */}
      <motion.h1
        style={{
          fontSize: "2.7rem",
          fontWeight: 900,
          lineHeight: 1.18,
          textAlign: "left",
          position: "relative",
          backgroundImage: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "0.01em",
        }}
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.9, type: "spring" }}
      >
        <Typewriter
          words={[
            "Empowering Freelance Success",
            "Manage. Meet. Get Paid.",
            "All remote work. Zero chaos.",
          ]}
          loop={Infinity}
          cursor
          cursorStyle="❖"
          typeSpeed={52}
          deleteSpeed={22}
          delaySpeed={1400}
        />
        {/* Underline glow */}
        <motion.span
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 1.1, type: "spring" }}
          style={{
            display: "block",
            height: 8,
            width: 98,
            marginTop: 9,
            borderRadius: 44,
            background: gradient,
            filter: "blur(3px)",
            position: "absolute",
            left: 0,
            bottom: -16,
            zIndex: 0,
            opacity: 0.68,
          }}
        />
        {/* Sparkle highlights */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.28,
            type: "tween",
          }}
          style={{
            position: "absolute",
            left: 86,
            bottom: -17,
            color: sparkle,
            fontSize: 28,
            opacity: 0.7,
            textShadow: `0 0 8px ${sparkle}`,
            pointerEvents: "none",
          }}
        >
          ✧
        </motion.span>
      </motion.h1>

      {/* Static Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 17 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, type: "spring" }}
        style={{
          fontSize: "1.22rem",
          color: darkMode ? "#e0ecff" : "#215b6f",
          fontWeight: 500,
          marginTop: 5,
          textAlign: "left",
          lineHeight: 1.57,
          letterSpacing: 0.01,
        }}
      >
        The{" "}
        <span style={{ color: "white", fontWeight: 700, letterSpacing: 0 }}>
          fastest
        </span>{" "}
        way to{" "}
        <span style={{ color: accent1, fontWeight: 800, letterSpacing: 0 }}>
          hire, meet, and manage
        </span>{" "}
        freelance talent.
        <br />
        <span
          style={{
            color: accentSub,
            fontWeight: 600,
            letterSpacing: ".01em",
          }}
        >
          Secure calls, scheduling & payments — all in one.
        </span>
      </motion.p>
    </div>
  );
}

export default HeroGlassText;

function GetStartedButton({ darkMode }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.095,
        borderColor: "#49a6e9",
        boxShadow: darkMode
          ? "0px 6px 30px 0px #49a6e9CC"
          : "0px 6px 30px 0px #45cafc88",
      }}
      transition={{ type: "spring", stiffness: 230, damping: 18 }}
      style={{
        fontWeight: 900,
        fontSize: 20,
        padding: "16px 54px",
        background: darkMode
          ? "linear-gradient(90deg, #2762f0 70%, #7c57ff 100%)"
          : "linear-gradient(90deg, #49a6e9 30%, #65e0f7 100%)",
        color: "#fff",
        border: "3px solid #49a6e9",
        borderRadius: 16,
        boxShadow: darkMode ? "0 7px 24px #2762f055" : "0 7px 22px #45cafc44",
        cursor: "pointer",
        outline: "none",
        letterSpacing: ".01em",
        position: "relative",
        marginTop: "1.5rem",
      }}
    >
      Get Started
    </motion.button>
  );
}

// export function DynamicTeamLottie() {
//   const [animationData, setAnimationData] = useState<null | any>(null);

//   useEffect(() => {
//     fetch(
//       "https://assetsX.lottiefiles.com/free-animation/freelancer-working-me0AIyqZQk.json"
//     ) // ← new better URL
//       .then((res) => res.json())
//       .then(setAnimationData)
//       .catch(() => setAnimationData(false));
//   }, []);

//   if (animationData === false) {
//     return <div>Error loading animation.</div>;
//   }
//   if (!animationData) {
//     return <div>Loading animation...</div>;
//   }

//   return (
//     <Lottie
//       animationData={animationData}
//       loop={true}
//       style={{
//         width: 400,
//         height: 320,
//         borderRadius: 16,
//         background: "transparent", // maybe remove background or use theme color
//         margin: "0 auto",
//       }}
//     />
//   );
// }

export function Hero() {
  const { darkMode } = useTheme();

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 2rem 2rem 2rem",
        minHeight: 520,
        position: "relative",
        overflow: "hidden",
        borderRadius: "36px",
        boxShadow: darkMode ? "0 12px 48px #21407725" : "0 0px 38px #cdeeff24",
      }}
    >
      {/* Row with image (left) + text (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          position: "relative",
          gap: "3rem",
        }}
      >
        {/* LEFT - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, type: "spring" }}
          style={{
            flex: "0 1 50%",
            textAlign: "left", // ✅ aligns image fully left
          }}
        >
          <Lottie animationData={hero_image} />
        </motion.div>

        {/* RIGHT - Text */}
        <div style={{ flex: "0 1 50%" }}>
          <HeroGlassText darkMode={darkMode} />
        </div>

        {/* BUTTON centered below */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-10px",
            transform: "translateX(-50%)",
          }}
        >
          <GetStartedButton darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
}
