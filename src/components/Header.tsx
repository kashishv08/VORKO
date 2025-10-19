"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

export type UserPublicMetadata = {
  role?: "FREELANCER" | "CLIENT";
  onboardingComplete?: boolean;
};

export function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const publicMetadata = (user?.publicMetadata as UserPublicMetadata) ?? {};
  const role = publicMetadata.role?.toLowerCase() ?? "";

  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--background)]/80 shadow-md border-b border-[var(--border)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <span
            className={`text-2xl sm:text-2xl font-extrabold italic tracking-widest cursor-pointer 
            text-[var(--accent)] dark:text-[var(--accent-dark)]
            px-2 transform transition-transform duration-500 ${
              logoHovered ? "rotate-3 scale-110" : "rotate-0 scale-100"
            }`}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{
              textShadow: "0 2px 15px var(--accent)/40",
              letterSpacing: "0.16em",
            }}
          >
            VORKO
          </span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-3 ml-4 cursor-poniter">
          <ThemeToggle />

          {isLoaded ? (
            isSignedIn && user ? (
              <div className="relative pl-2">
                <div className="rounded-[2rem] bg-[var(--surface)]/30 dark:bg-[var(--surface-dark)]/30 shadow-lg py-1 px-2 flex items-center gap-2 border border-[var(--border)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "w-9 h-9 shadow focus:outline-[var(--accent)]",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Dashboard"
                        href={`/${role}/dashboard`}
                        labelIcon={<LayoutDashboard />}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                  <span className="hidden sm:inline text-[var(--text-primary)] font-semibold text-sm ml-1 transition-colors">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 sm:gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer px-4 font-semibold transition-transform duration-300 hover:scale-105 hover:text-[var(--accent)]"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/role-selection">
                  <Button
                    size="sm"
                    className="cursor-pointer px-4 font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] border-0 shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <span className="text-sm text-[var(--text-secondary)] px-2 animate-pulse">
              Loading...
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

// Optional NavLink helper for future use
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative py-1.5 px-3 rounded group transition-colors duration-300 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-[var(--accent)]"
    >
      <span className="transition-transform group-hover:scale-105">
        {children}
      </span>
      <span className="block h-[2px] w-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded absolute left-1/2 -bottom-1 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
    </Link>
  );
}
