"use client";
import { Avatar, Box, Card, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./context/UserContextProvider";

function Header() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    if (!user) return;
    Cookies.remove("vorkoToken");
    router.push("/");
  };
  return (
    <nav className="w-full flex justify-between items-center py-4 px-8 shadow-sm bg-gray-500">
      <h1 className="text-xl font-bold">
        <Link href={"/"}>VORKO</Link>
      </h1>
      <div className="flex gap-6 items-center">
        {/* <a href="#" className="hover:underline text-white">
          Browse
        </a>
        <a href="#" className="hover:underline text-white">
          How it works
        </a> */}

        {!user ? (
          <div className="justify-between">
            <a href="/login" className="hover:underline">
              Log in
            </a>
            <Link
              href={"/signup"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Box maxWidth="240px">
                <Card>
                  <Flex gap="3" align="center">
                    <Avatar
                      size="3"
                      radius="full"
                      fallback={user ? user.name.charAt(0).toUpperCase() : "U"}
                    />
                    <Box>
                      <Text as="div" size="2" weight="bold">
                        {user.name}
                      </Text>
                      <Text as="div" size="2" color="gray">
                        {user.role}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Edit</DropdownMenu.Item>
              <DropdownMenu.Item>
                <Link
                  href={
                    user.role == "CLIENT"
                      ? "/client/dashboard"
                      : "/freelancer/dashboard"
                  }
                >
                  Dashboard
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
    </nav>
  );
}

export default Header;
