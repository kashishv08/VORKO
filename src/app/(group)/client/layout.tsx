import { Sidebar } from "@/src/components/client/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar is fixed */}
      <Sidebar />

      {/* Main content */}
      <main className={`flex-1 ml-16 bg-background`}>{children}</main>
    </div>
  );
}
