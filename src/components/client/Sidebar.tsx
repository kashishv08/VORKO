"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/src/components/context/ThemeContext";
import {
  LayoutDashboard,
  Folder,
  MessageSquare,
  Video,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Sidebar = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const links = [
    {
      name: "Dashboard",
      href: "/client/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Projects",
      href: "/client/project",
      icon: <Folder className="w-5 h-5" />,
    },
    {
      name: "Messages",
      href: "/client/chat",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Meetings",
      href: "/meetings",
      icon: <Video className="w-5 h-5" />,
    },
    { name: "Reviews", href: "/reviews", icon: <Star className="w-5 h-5" /> },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Detect outside clicks to close the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine current visible state (expanded if open or hovered)
  const isExpanded = open || hovered;

  return (
    <motion.aside
      ref={sidebarRef}
      initial={{ width: isExpanded ? 256 : 72 }}
      animate={{ width: isExpanded ? 256 : 72 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onMouseEnter={() => !open && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 flex flex-col border-r backdrop-blur-xl shadow-2xl transition-all"
      style={{
        background: "rgba(24,35,15,0.6)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 mt-2 px-2">
        {links.map((link, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(31,125,83,0.25)",
              boxShadow: "0 8px 24px rgba(31,125,83,0.25)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative rounded-xl overflow-hidden"
          >
            <Link
              href={link.href}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
              style={{
                color: "var(--foreground)",
              }}
            >
              <motion.span
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex-shrink-0"
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
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip (when collapsed) */}
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
        ))}
      </nav>

      {/* Glow footer line */}
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
