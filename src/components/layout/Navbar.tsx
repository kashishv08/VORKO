"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { LancifyLogo } from "../LancifyLogo";
import { LayoutDashboard, Briefcase, FileText, MessageSquare, ChevronDown, Menu, X, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../ThemeToggle";

export type UserPublicMetadata = {
  role?: "FREELANCER" | "CLIENT";
  onboardingComplete?: boolean;
};

export function Navbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [logoHovered, setLogoHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicMetadata = (user?.publicMetadata as UserPublicMetadata) ?? {};
  const role = publicMetadata.role ?? "CLIENT";
  const isClient = role === "CLIENT";

  const clientLinks = [
    { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client/project", label: "My Projects", icon: Briefcase },
    { href: "/client/project/new", label: "Post a Project", icon: PlusCircle },
    { href: "/client/contract", label: "Contracts", icon: FileText },
    { href: "/client/chat", label: "Messages", icon: MessageSquare },
  ];
  const freelancerLinks = [
    { href: "/freelancer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/freelancer/project", label: "Find Work", icon: Search },
    { href: "/freelancer/contract", label: "My Contracts", icon: FileText },
    { href: "/freelancer/chat", label: "Messages", icon: MessageSquare },
  ];

  const links = isClient ? clientLinks : freelancerLinks;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          <LancifyLogo />

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {links.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {/* <ThemeToggle /> */}

            <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {role}
              </span>

              {isLoaded && user && (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-bold text-foreground leading-none">{user.fullName}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-lg border border-border shadow-sm",
                        userButtonTrigger: "focus:outline-none rounded-lg transition-shadow hover:shadow-md"
                      }
                    }}
                  />
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <LancifyLogo />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="px-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {role} Account
                </span>
              </div>
              
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer / User Info */}
            {user && (
              <div className="p-4 border-t border-border bg-gray-50/50">
                <div className="flex items-center gap-3 px-2">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 rounded-lg border border-border shadow-sm",
                      }
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-none truncate">{user.fullName}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
