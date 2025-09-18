"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  { href: "/freelancer/dashboard", label: "Dashboard" },
  { href: "/freelancer/project", label: "Browse Projects" },
  { href: "/freelancer/proposal", label: "My Proposals" },
  { href: "/freelancer/contract", label: "My Contracts" },
];

function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <nav className="flex flex-col gap-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "bg-blue-400 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBar;
