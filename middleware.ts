import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  /**
   * 1. TRULY PUBLIC ROUTES
   * Only the landing page and auth-related assets.
   */
  const isPublicRoute = 
    pathname === "/" ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/register") || // Your new signup page
    pathname.startsWith("/verify-email") || // Your new OTP page
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  /**
   * 2. AUTHENTICATION CHECK
   * If not logged in, they can't see Marketplace, Crib, Sidequest, or Dashboard.
   */
  if (!token) {
    // Redirect to your custom signin page
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const verificationStatus = token.verificationStatus;

  /**
   * 3. ACTION-BASED VERIFICATION LOCK
   * Users can BROWSE the marketplace now (since they are logged in),
   * but they can't POST or MANAGE without being APPROVED.
   */
  const verificationRequiredRoutes = [
    "/post",
    "/rent",
    "/business/create",
    "/dashboard/manage",
    "/admin", // Only for Approved Admin
  ];

  const requiresVerification = verificationRequiredRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresVerification && verificationStatus !== "APPROVED") {
    // If logged in but trying to do a "pro" action, send to verify
    return NextResponse.redirect(new URL("/verify", req.url));
  }

  return NextResponse.next();
}

/**
 * 4. MATCHER
 * Added the pillars to the matcher so the middleware actually runs on them.
 */
export const config = {
  matcher: [
    "/marketplace/:path*",
    "/crib/:path*",
    "/sidequest/:path*",
    "/founders/:path*",
    "/post/:path*",
    "/rent/:path*",
    "/business/:path*",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};