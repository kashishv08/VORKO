import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "./lib/service/clerk";

type PublicMetadata = {
  onboardingComplete?: boolean;
  role?: "FREELANCER" | "CLIENT";
};

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  let pathname = url.pathname;

  // Remove trailing slash
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  const authPublic = ["/sign-in", "/sign-up", "/role-selection"];
  const alwaysPublicPrefixes = ["/favicon.ico", "/trpc", "/api"];

  // 1. Allow strictly public assets/APIs
  if (alwaysPublicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // 2. Handle Non-Authenticated Users
  if (!userId) {
    const publicRoutes = ["/sign-in", "/sign-up", "/role-selection"];
    const isPublic = pathname === "/" || publicRoutes.some((route) => pathname.startsWith(route));
    
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 3. Handle Authenticated Users
  if (pathname.includes("sso-callback")) {
    return NextResponse.next();
  }

  const user = await clerkClient.users.getUser(userId);
  const publicMetadata = (user.publicMetadata ?? {}) as PublicMetadata;

  const roleParam = url.searchParams.get("role") as PublicMetadata["role"];
  const role = publicMetadata.role ?? roleParam;
  const lowerRole = role?.toLowerCase();

  const onboardingComplete = publicMetadata.onboardingComplete ?? false;

  // Add this line around line 46 in middleware.ts:
  console.log("MIDDLEWARE CHECK:", { pathname, role, onboardingComplete });



  // --- ROLE & ONBOARDING ENFORCEMENT ---
  if (!role && pathname !== "/role-selection") {
    return NextResponse.redirect(new URL("/role-selection", req.url));
  }

  if (role && !onboardingComplete && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL(`/onboarding?role=${role}`, req.url));
  }

  if (onboardingComplete && (pathname === "/onboarding" || pathname === "/role-selection")) {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  if (onboardingComplete && authPublic.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  // --- ROLE-BASED ROUTE RESTRICTION ---
  const protectedPrefixes = ["/client", "/freelancer"];
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute && pathname.startsWith("/client") && role !== "CLIENT") {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  if (
    isProtectedRoute &&
    pathname.startsWith("/freelancer") &&
    role !== "FREELANCER"
  ) {
    return NextResponse.redirect(new URL(`/${lowerRole}/dashboard`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
