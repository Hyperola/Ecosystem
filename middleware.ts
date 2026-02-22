import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // 1. PUBLIC ROUTES (Anyone can see these)
    // Included .startsWith("/signin") so /signin/email is considered public
    const isPublicRoute = 
      pathname === "/" || 
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify-email") ||
      pathname.startsWith("/signin") || 
      pathname.startsWith("/marketplace") || 
      pathname.startsWith("/explore");

    // 2. AUTH PAGE CHECK
    // If user is logged in, don't let them go to ANY signin page (root or email)
    if (pathname.startsWith("/signin") || pathname === "/register") {
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // 3. PROTECT PRIVATE ROUTES
    if (!token && !isPublicRoute) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 4. VERIFICATION "SOFT" LOCK
    // This allows Google users to see the dashboard but locks specific actions
    if (token) {
      const verificationStatus = token.verificationStatus;
      
      // ONLY these routes trigger a redirect to the verification page
      const restrictedRoutes = [
        "/admin", 
        "/founders/create", 
        "/marketplace/create", 
        "/agent/upload"
      ];
      
      const isTryingToAccessRestricted = restrictedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // If user isn't APPROVED and hits a restricted route, send to verify
      if (isTryingToAccessRestricted && verificationStatus !== "APPROVED") {
        return NextResponse.redirect(new URL("/verify", req.url));
      }
      
      // Note: If they are just going to /dashboard, this block is skipped.
    }

    return NextResponse.next();
  } catch (error) {
    // Fail safe to prevent site-wide crashes during build or edge errors
    return NextResponse.next();
  }
}

export const config = {
  // Matches all routes except api, static files, and internal Next.js files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};