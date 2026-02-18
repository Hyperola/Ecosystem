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
   * -------------------------
   * 1. PUBLIC ROUTES
   * -------------------------
   * Anyone (logged in or not) can access these
   */
  if (
    pathname === "/" ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/items") ||
    pathname.startsWith("/businesses") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/api/auth") || // includes OAuth + verify page
    pathname.startsWith("/api/verification") || // submit verification
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  /**
   * -------------------------
   * 2. AUTH REQUIRED
   * -------------------------
   */
  if (!token) {
    return NextResponse.redirect(
      new URL("/api/auth/signin", req.url)
    );
  }

  const verificationStatus = token.verificationStatus;

  /**
   * -------------------------
   * 3. ROUTES THAT REQUIRE VERIFICATION
   * -------------------------
   */
  const verificationRequiredRoutes = [
    "/post",
    "/rent",
    "/business/create",
    "/dashboard/manage",
  ];

  const requiresVerification = verificationRequiredRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Logged in BUT not verified → force verification
  if (
    requiresVerification &&
    verificationStatus !== "APPROVED"
  ) {
    return NextResponse.redirect(
      new URL("/api/auth/verify", req.url)
    );
  }

  /**
   * -------------------------
   * 4. VERIFIED USERS SHOULD NOT SEE VERIFY PAGE
   * -------------------------
   */
  if (
    pathname.startsWith("/api/auth/verify") &&
    verificationStatus === "APPROVED"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

/**
 * -------------------------
 * 5. MATCHER
 * -------------------------
 * Only protect what needs protection
 */
export const config = {
  matcher: [
    "/post/:path*",
    "/rent/:path*",
    "/business/:path*",
    "/dashboard/:path*",
    "/api/auth/verify",
  ],
};
