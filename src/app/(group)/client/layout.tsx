import { Sidebar } from "@/src/components/client/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="flex w-full">
            <Sidebar/>
            <div className="w-full">
            {children} 
            </div>
        </div>
  );
}
