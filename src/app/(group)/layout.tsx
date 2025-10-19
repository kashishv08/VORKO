"use client";
import { Header } from "@/src/components/Header";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

function Layout({ children }: { children: ReactNode }) {
  return (
    <Theme>
      <div>
        {" "}
        <div className="relative w-full">
          <div className="fixed w-full z-10 top-0 left-0">
            <Header />
          </div>
          <div className="pt-16">{children}</div>
        </div>
        <Toaster position="top-right" />
      </div>
    </Theme>
  );
}

export default Layout;
