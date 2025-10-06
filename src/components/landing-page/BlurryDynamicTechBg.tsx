import { motion } from "framer-motion";

export function BlurryDynamicTechBg({ children }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Blurred image background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          background:
            'url("https://png.pngtree.com/background/20231014/original/pngtree-d-rendered-tech-background-abstract-lines-and-dots-forming-an-internet-picture-image_5533781.jpg") center/cover no-repeat',
          filter: "blur(18px) brightness(0.92) saturate(128%)",
        }}
        aria-hidden="true"
      />
      {/* Animated SVG overlay */}
      <motion.svg
        width="100vw"
        height="100vh"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Animate some dots */}
        <motion.circle
          cx="18%"
          cy="25%"
          r="10"
          fill="#23D5AB"
          initial={{ cy: "25%" }}
          animate={{ cy: ["25%", "29%", "23%"] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
          opacity={0.17}
        />
        <motion.circle
          cx="74%"
          cy="64%"
          r="14"
          fill="#cddcfa"
          animate={{ cx: ["74%", "80%", "74%"] }}
          transition={{ duration: 13, repeat: Infinity, repeatType: "mirror" }}
          opacity={0.13}
        />
        {/* Animate a line */}
        <motion.line
          x1="12%"
          y1="20%"
          x2="82%"
          y2="85%"
          stroke="#4e9cff"
          strokeWidth="3"
          opacity={0.09}
          animate={{ x2: ["68%", "82%", "77%"] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
        />
      </motion.svg>
      {/* Content area */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
