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
      href: "/freelancer/dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="w-6 h-6" />,
    },
    {
      href: "/freelancer/project",
      label: "Browse Projects",
      icon: <FolderIcon className="w-6 h-6" />,
    },
    {
      href: "/freelancer/proposal",
      label: "My Proposals",
      icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    {
      href: "/freelancer/contract",
      label: "My Contracts",
      icon: <FolderIcon className="w-6 h-6" />,
    },
  ];

  const bg = theme === "light" ? "bg-white" : "bg-gray-900";
  const textPrimary = theme === "light" ? "text-gray-700" : "text-gray-200";

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } ${bg} shadow-md`}
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
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors 
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : `${textPrimary} hover:bg-blue-500 hover:text-white`
                }
                ${!open ? "justify-center" : ""}`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {open && <span className="font-medium">{link.label}</span>}

              {/* Tooltip on hover when collapsed */}
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
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
