"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should NOT have the standard sidebar/navbar layout
  const isCleanPage = pathname.includes("/onboarding") || pathname.includes("/role-selection") || pathname.includes("/meeting");

  if (isCleanPage) {
    return (
      <Theme>
        <div className="bg-background min-h-screen">
          {children}
          <Toaster position="top-right" />
        </div>
      </Theme>
    );
  }

  return (
    <Theme>
      <div className="bg-slate-50/50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </Theme>
  );
}
