"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  PlusCircle,
  Search,
} from "lucide-react";

export type UserPublicMetadata = {
  role?: "FREELANCER" | "CLIENT";
  onboardingComplete?: boolean;
};

export function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  const publicMetadata = (user?.publicMetadata as UserPublicMetadata) ?? {};
  const role = publicMetadata.role ?? "CLIENT";
  const isClient = role === "CLIENT";

  const clientLinks = [
    { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client/project", label: "My Projects", icon: Briefcase },
    { href: "/client/project/new", label: "Post a Project", icon: PlusCircle }, // Assuming /new is the route
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
    <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border min-h-full hidden lg:block">
      <nav className="py-6 px-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/client/dashboard" && href !== "/freelancer/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-sidebar-foreground hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
