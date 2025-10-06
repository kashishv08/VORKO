import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "./lib/service/clerk";

type PublicMetadata = {
  onboardingComplete?: boolean;
  role?: "FREELANCER" | "CLIENT";
};

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  let pathname = url.pathname;

  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  const authPublic = ["/sign-in", "/sign-up", "/role-selection"];
  const alwaysPublicPrefixes = ["/", "/favicon.ico", "/trpc"];

  if (alwaysPublicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    if (authPublic.includes(pathname)) return;
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const user = await clerkClient.users.getUser(userId);
  const publicMetadata = (user.publicMetadata ?? {}) as PublicMetadata;
  const onboardingComplete = publicMetadata.onboardingComplete ?? false;
  const role = publicMetadata.role;
  const lowerRole = role?.toLowerCase();

  if (!onboardingComplete && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (onboardingComplete && pathname === "/onboarding") {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  if (onboardingComplete && authPublic.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  // Role-based route restriction
  const protectedPrefixes = [`/${lowerRole}`];
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (
    onboardingComplete &&
    lowerRole &&
    !alwaysPublicPrefixes.includes(pathname) &&
    !authPublic.includes(pathname) &&
    pathname !== "/onboarding" &&
    !isProtectedRoute
  ) {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
