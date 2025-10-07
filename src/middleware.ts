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
  const alwaysPublicPrefixes = ["/", "/favicon.ico", "/trpc", "/api"];

  // Allow public routes
  if (alwaysPublicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check auth
  const { userId } = await auth();
  if (!userId) {
    if (authPublic.includes(pathname)) return NextResponse.next();
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Skip SSO callback routes to prevent undefined metadata
  if (pathname.includes("sso-callback")) {
    return NextResponse.next();
  }

  // Get Clerk user
  const user = await clerkClient.users.getUser(userId);
  const publicMetadata = (user.publicMetadata ?? {}) as PublicMetadata;

  // Fallback to query param role if metadata is undefined
  const roleParam = url.searchParams.get("role") as PublicMetadata["role"];
  const role = publicMetadata.role ?? roleParam;
  const lowerRole = role?.toLowerCase();

  const onboardingComplete = publicMetadata.onboardingComplete ?? false;

  console.log(
    "middleware publicMetadata:",
    publicMetadata,
    "role fallback:",
    roleParam
  );

  // --- ONBOARDING LOGIC ---
  if (!onboardingComplete && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL(`/onboarding?role=${role}`, req.url));
  }

  if (onboardingComplete && pathname === "/onboarding") {
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
