"use client";
import { Role } from "@prisma/client";
import { createContext, ReactNode } from "react";

export type userNoPass = {
  id: string;
  email: string;
  name: string;
  role: Role;
  bio: string | null;
  skills: string[];
  avatar: string | null;
};

export const UserContext = createContext<{
  user?: userNoPass;
}>({});

function UserContextProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: userNoPass;
}) {
  console.log("provider User", user);
  return (
    <div>
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    </div>
  );
}

export default UserContextProvider;
