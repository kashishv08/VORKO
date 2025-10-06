import { Sidebar } from "@/src/components/client/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user = await getUserFromDb();
  return (
    // <UserContextProvider user={user}>
    <div className="flex w-full justify-between">
      <div className="">
        <Sidebar />
      </div>
      <div className="w-full">{children}</div>
    </div>
    // </UserContextProvider>
  );
}
