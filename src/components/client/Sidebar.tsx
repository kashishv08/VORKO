"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/src/components/context/ThemeContext";
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  StarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/client/dashboard",
      icon: <HomeIcon className="w-6 h-6" />,
    },
    {
      name: "All Projects",
      href: "/client/project",
      icon: <FolderIcon className="w-6 h-6" />,
    },
    {
      name: "Proposals",
      href: "/client/proposals",
      icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    {
      name: "Messages",
      href: "/chat",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    },
    {
      name: "Meetings",
      href: "/meetings",
      icon: <VideoCameraIcon className="w-6 h-6" />,
    },
    {
      name: "Reviews",
      href: "/reviews",
      icon: <StarIcon className="w-6 h-6" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Cog6ToothIcon className="w-6 h-6" />,
    },
  ];

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ${
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
          className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition`}
        >
          {open ? "⬅" : "➡"}
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-2">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-blue-500 hover:text-white ${
              !open ? "justify-center" : ""
            }`}
          >
            {/* Icon */}
            <span className="flex-shrink-0">{link.icon}</span>

            {/* Label */}
            {open && <span className="font-medium">{link.name}</span>}

            {/* Tooltip when collapsed */}
            {!open && (
              <span
                className={`absolute left-full ml-2 px-2 py-1 rounded-md text-sm whitespace-nowrap
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
        ))}
      </nav>
    </aside>
  );
};
