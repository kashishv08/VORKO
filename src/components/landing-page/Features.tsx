import { Box } from "@mui/material";
import { Briefcase, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    icon: Briefcase,
    title: "Seamless Scheduling",
    description: "Manage and schedule your freelance projects effortlessly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Communication",
    description: "Chat and call securely with Radix-powered encryption.",
  },
  {
    icon: Users,
    title: "Collaborative Tools",
    description: "Real-time document sharing and team collaboration.",
  },
];

export default function Features() {
  const { darkMode } = useTheme();

  return (
    <section
      style={{
        padding: "2.8rem 2rem",
        background: "transparent",
        borderRadius: "26px",
        margin: "2.2rem",
        marginBottom: 0,
        boxShadow: darkMode
          ? "rgba(314, 222, 255, 314.208)0px 8px 50px"
          : "rgba(434, 580, 519, 234.024) 0px 14px 55px",
        backdropFilter: "none",
      }}
    >
      <h2
        style={{
          color: darkMode ? "#fff" : "rgba(244, 252, 255, 0.78)",
          fontWeight: 900,
          fontSize: "2.17rem",
          marginBottom: "1.7rem",
          letterSpacing: ".01em",
          textShadow: darkMode ? "0 1px 8px #193a8542" : "0 1px 10px #c8e0f055",
        }}
      >
        Key Features
      </h2>
      <Box
        sx={{
          display: "flex",
          gap: "2.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {features.map((feature, i) => {
          const IconComp = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ y: 32, opacity: 0, scale: 0.7 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                type: "spring",
                delay: i * 0.13,
              }}
              whileHover={{
                scale: 1.12,
                rotate: 8,
                boxShadow: darkMode
                  ? "0 14px 38px #398ec099"
                  : "0 14px 38px #48cafc99",
              }}
              style={{
                background: darkMode
                  ? "linear-gradient(120deg,#232840 86%,#373e4a 100%)"
                  : "rgba(244,252,255,0.78)",
                backdropFilter: darkMode ? undefined : "blur(13px)",
                border: darkMode
                  ? "2px solid #3e53a6"
                  : "1.5px solid #b8e5fc88",
                boxShadow: darkMode
                  ? // Vivid blue-teal shadow on dark, stronger and larger
                    "0 8px 42px 0 #49a6e9b0, 0 0px 16px 0 #7c57ff55"
                  : // Even deeper, wider shadow on light mode
                    "0 14px 48px 0 #62cbfd44, 0 0 0 #fff",
                color: darkMode ? "#fff" : "#205093",
                padding: "2.1rem 1.5rem",
                borderRadius: "20px",
                minWidth: "210px",
                maxWidth: "270px",
                width: "95%",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
                transition: "box-shadow 0.25s, border .22s",
              }}
            >
              <motion.div
                whileHover={{
                  y: -18,
                  scale: 1.16,
                  filter: darkMode
                    ? "drop-shadow(0 0 17px #7c57ff77)"
                    : "drop-shadow(0 0 18px #49a6e988)",
                }}
                animate={{
                  y: [0, -7],
                  scale: [1, 1.07],
                }}
                transition={{
                  duration: 3.4 + Math.random(),
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  margin: "0 auto 22px auto",
                  background: darkMode
                    ? "linear-gradient(120deg, #4199f8 22%, #7b6aff 97%)"
                    : "linear-gradient(120deg, #62cbfd 8%, #2EDFF7 95%)",
                  boxShadow: darkMode
                    ? "0 3px 22px #7c57ff44"
                    : "0 6px 19px #62cbfd33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconComp
                  size={34}
                  strokeWidth={2.19}
                  style={{
                    color: darkMode ? "#fff" : "#2196f3",
                    transition: "color 0.3s",
                  }}
                />
              </motion.div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.14rem",
                  marginBottom: ".6rem",
                  color: darkMode ? "#fff" : "#225ca3",
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  color: darkMode ? "#b7c1d3" : "#3672ae",
                  fontSize: "1.07rem",
                }}
              >
                {feature.description}
              </div>
            </motion.div>
          );
        })}
      </Box>
    </section>
  );
}
