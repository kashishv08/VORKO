import SideBar from "@/src/components/freelancer/freelancer-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <SideBar />
      <div className="w-full">{children}</div>
    </div>
  );
}
