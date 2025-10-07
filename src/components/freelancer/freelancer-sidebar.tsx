"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/src/components/context/ThemeContext";
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/freelancer/dashboard",
      icon: <HomeIcon className="w-6 h-6" />,
    },
    {
      name: "Browse Projects",
      href: "/freelancer/project",
      icon: <FolderIcon className="w-6 h-6" />,
    },
    {
      name: "My Proposals",
      href: "/freelancer/proposal",
      icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    {
      name: "My Contracts",
      href: "/freelancer/contract",
      icon: <FolderIcon className="w-6 h-6" />,
    },
  ];

  return (
    <aside
      className={`fixed top-16.5 left-0 h-screen flex flex-col transition-all duration-300 z-50 ${
        open ? "w-64" : "w-16"
      } ${
        theme === "light"
          ? "bg-white text-gray-700"
          : "bg-gray-900 text-gray-200"
      } shadow-md`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {open ? "⬅" : "➡"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 mt-2">
        {links.map((link, i) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={i}
              href={link.href}
              className={`group relative flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-blue-500 hover:text-white ${
                !open ? "justify-center" : ""
              }`}
              style={{ backgroundColor: isActive ? "#3b82f6" : "transparent" }}
            >
              {/* Icon */}
              <span className="flex-shrink-0">{link.icon}</span>

              {/* Label */}
              {open && <span className="font-medium">{link.name}</span>}

              {/* Tooltip when collapsed */}
              {!open && (
                <span
                  className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md text-sm whitespace-nowrap
                    ${
                      theme === "light"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    } 
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                >
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
