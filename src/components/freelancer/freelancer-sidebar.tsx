"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "@/src/components/context/ThemeContext";
import {
  Home,
  Folder,
  MessageCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Sidebar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const links = [
    {
      name: "Dashboard",
      href: "/freelancer/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Projects",
      href: "/freelancer/project",
      icon: <Folder className="w-5 h-5" />,
    },
    {
      name: "Inbox",
      href: "/freelancer/chat",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      name: "Contracts",
      href: "/freelancer/contract",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isExpanded = open || hovered;

  // THEME COLORS
  const sidebarBg =
    theme === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(18, 30, 20, 0.8)";
  const sidebarBorder =
    theme === "light" ? "rgba(31,125,83,0.25)" : "rgba(255,255,255,0.06)";
  const hoverBg =
    theme === "light" ? "rgba(31,125,83,0.12)" : "rgba(31,125,83,0.25)";
  const hoverText = theme === "light" ? "var(--primary)" : "var(--highlight)";
  const activeBg = "var(--primary)";
  const activeText = "#fff";

  return (
    <motion.aside
      ref={sidebarRef}
      initial={{ width: isExpanded ? 256 : 72 }}
      animate={{ width: isExpanded ? 256 : 72 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onMouseEnter={() => !open && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 flex flex-col border-r shadow-glow backdrop-blur-xl transition-all"
      style={{
        background: sidebarBg,
        borderColor: sidebarBorder,
        color: "var(--foreground)",
      }}
    >
      {/* Links */}
      <nav className="flex flex-col gap-3 mt-3 px-2">
        {links.map((link, i) => {
          const isActive = pathname === link.href;

          return (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.03,
                backgroundColor: isActive ? activeBg : hoverBg,
                boxShadow:
                  theme === "light"
                    ? "0 8px 20px rgba(31,125,83,0.12)"
                    : "0 8px 24px rgba(31,125,83,0.25)",
              }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className={`relative rounded-xl overflow-hidden ${
                isActive ? "shadow-glow" : ""
              }`}
              style={{
                backgroundColor: isActive ? activeBg : "transparent",
              }}
            >
              <Link
                href={link.href}
                className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
              >
                {/* Icon */}
                <motion.span
                  whileHover={{ rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex-shrink-0"
                  style={{
                    color: isActive ? activeText : hoverText,
                  }}
                >
                  {link.icon}
                </motion.span>

                {/* Label */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium tracking-wide"
                      style={{
                        color: isActive
                          ? activeText // ✅ lock to white when active
                          : "var(--foreground)",
                      }}
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {!isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md text-sm whitespace-nowrap bg-[rgba(37,95,56,0.9)] text-white shadow-lg backdrop-blur-sm pointer-events-none"
                  >
                    {link.name}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Animated bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(31,125,83,0), rgba(31,125,83,0.6), rgba(31,125,83,0))",
            "linear-gradient(90deg, rgba(37,95,56,0), rgba(37,95,56,0.6), rgba(37,95,56,0))",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
      />
    </motion.aside>
  );
};
