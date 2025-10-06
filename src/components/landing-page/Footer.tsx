import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer
      style={{
        width: "100%",
        marginTop: "2.5rem",
        padding: "2.2rem 0 1.4rem 0",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        boxShadow: darkMode
          ? "0 -10px 30px #22305844"
          : "rgba(434, 580, 519, 234.024) 0px 14px 55px",
        position: "relative",
        color: darkMode ? "#a5c9e6" : "#294873",
        zIndex: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 1350,
          margin: "0 auto",
        }}
      >
        {/* Brand/Logo */}
        <span
          style={{
            fontWeight: 800,
            fontSize: "2rem",
            color: "#49a6e9",
            letterSpacing: "1.3px",
            userSelect: "none",
            marginBottom: 20,
            textShadow: "0 1px 16px #49a6e955",
          }}
        >
          VORKO
        </span>
        {/* Links */}
        <nav style={{ display: "flex", gap: "2.1rem", marginBottom: 12 }}>
          <a
            href="/"
            style={{
              color: darkMode ? "#b7cbdb" : "#316687",
              fontWeight: 500,
              fontSize: "1.08rem",
              textDecoration: "none",
              transition: "color 0.17s",
            }}
          >
            Home
          </a>
          <a
            href="/features"
            style={{
              color: darkMode ? "#b7cbdb" : "#316687",
              fontWeight: 500,
              fontSize: "1.08rem",
              textDecoration: "none",
              transition: "color 0.17s",
            }}
          >
            Features
          </a>
          <a
            href="/about"
            style={{
              color: darkMode ? "#b7cbdb" : "#316687",
              fontWeight: 500,
              fontSize: "1.08rem",
              textDecoration: "none",
              transition: "color 0.17s",
            }}
          >
            About
          </a>
          <a
            href="/contact"
            style={{
              color: darkMode ? "#b7cbdb" : "#316687",
              fontWeight: 500,
              fontSize: "1.08rem",
              textDecoration: "none",
              transition: "color 0.17s",
            }}
          >
            Contact
          </a>
        </nav>
        {/* Social Links */}
        <div
          style={{
            display: "flex",
            gap: "1.7rem",
            marginBottom: 13,
          }}
        >
          <motion.a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.18, color: "#49a6e9" }}
            style={{ color: darkMode ? "#bdd6ff" : "#167dcb" }}
          >
            <Github size={28} />
          </motion.a>
          <motion.a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.18, color: "#49a6e9" }}
            style={{ color: darkMode ? "#bdd6ff" : "#167dcb" }}
          >
            <Twitter size={28} />
          </motion.a>
          <motion.a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.18, color: "#49a6e9" }}
            style={{ color: darkMode ? "#bdd6ff" : "#167dcb" }}
          >
            <Linkedin size={28} />
          </motion.a>
        </div>
        {/* Copyright/Info */}
        <span
          style={{
            fontSize: "0.99rem",
            color: darkMode ? "#6c84ac" : "#6b859e",
            fontWeight: 400,
            letterSpacing: ".01em",
          }}
        >
          © {new Date().getFullYear()} VORKO · Crafted with 💙 for freelancers &
          teams
        </span>
      </motion.div>
    </footer>
  );
}
