"use client";

import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { DotIcon } from "lucide-react";

export type UserPublicMetadata = {
  role?: "FREELANCER" | "CLIENT";
  onboardingComplete?: boolean;
};

export function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const publicMetadata = (user?.publicMetadata as UserPublicMetadata) ?? {};
  const role = publicMetadata.role?.toLowerCase() ?? "";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 shadow-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <span
            className="text-2xl sm:text-2xl font-extrabold italic tracking-widest cursor-pointer 
            text-lime-600 dark:text-lime-400 px-2 
            hover:text-lime-500 focus-visible:ring-2 focus-visible:ring-lime-400 
            transition-colors drop-shadow-[0_1px_10px_lime]"
            style={{
              textShadow: "0 2px 10px #a3e63544",
              letterSpacing: "0.16em",
            }}
          >
            VORKO
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-7 font-semibold text-gray-700 dark:text-gray-200">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
        </nav> */}

        {/* User Section */}
        <div className="flex items-center gap-3 ml-4">
          <ThemeToggle />
          {isLoaded ? (
            isSignedIn && user ? (
              <div className="pl-2">
                <div className="rounded-[2rem] bg-white/20 dark:bg-black/30 shadow-lg py-1 px-2 flex items-center gap-2 border border-border/40 backdrop-blur-sm">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "w-9 h-9 shadow focus:outline-lime-400",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Dashboard"
                        labelIcon={<DotIcon />}
                        href={`/${role}/dashboard`}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                  <span className="hidden sm:inline text-gray-700 dark:text-gray-200 font-semibold text-sm ml-1">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-1 sm:gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer px-4 font-semibold"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/role-selection">
                  <Button
                    size="sm"
                    className="cursor-pointer px-4 font-bold bg-gradient-to-r from-lime-500 to-lime-400 border-0 shadow"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <span className="text-sm text-muted-foreground px-2">
              Loading...
            </span>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden justify-center gap-6 py-2 font-semibold text-gray-700 dark:text-gray-200 bg-background/80 shadow-inner border-t border-border/50">
        <NavLink href="/#features">Features</NavLink>
        <NavLink href="/#how-it-works">How It Works</NavLink>
      </nav>
    </header>
  );
}

// Helper nav link for consistent styles and active state support in the future
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
      className="relative py-1.5 px-2 rounded transition-colors hover:text-lime-600 dark:hover:text-lime-200 focus-visible:outline focus-visible:outline-lime-400"
    >
      <span className="transition-all">{children}</span>
      {/* Animated underline on hover/focus */}
      <span className="block h-[2px] w-0 bg-gradient-to-r from-lime-500 to-green-400 rounded absolute left-1/2 -bottom-1 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
    </Link>
  );
}
