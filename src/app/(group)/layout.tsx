import UserContextProvider, {
  userNoPass,
} from "@/src/components/context/UserContextProvider";
import Header from "@/src/components/Header";
import { getUserFromCookie } from "@/src/lib/helper";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

async function layout({ children }: { children: ReactNode }) {
  const user = (await getUserFromCookie()) as userNoPass;
  if (!user) redirect("/login");
  console.log("layout user", user);

  return (
    <div>
      <UserContextProvider user={user}>
        <Header />
        {children}
      </UserContextProvider>
    </div>
  );
}

export default layout;
