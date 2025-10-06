import { Sidebar } from "@/src/components/freelancer/freelancer-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <div className="">
        <Sidebar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
