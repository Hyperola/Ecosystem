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
    const isPublicRoute = 
      pathname === "/" || 
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify-email") ||
      pathname.startsWith("/marketplace") || // Allow browsing marketplace
      pathname.startsWith("/explore");

    // 2. AUTH PAGE CHECK (Signin)
    if (pathname === "/signin") {
      if (token) {
        // If already logged in, send them to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // 3. PROTECT PRIVATE ROUTES
    if (!token && !isPublicRoute) {
      // If not logged in and trying to access a private route, send to signin
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 4. VERIFICATION LOCK (Strictly for specific actions)
    if (token) {
      const verificationStatus = token.verificationStatus;
      
      // Routes that require an APPROVED status
      const restrictedRoutes = ["/admin", "/founders/create", "/marketplace/create", "/agent/upload"];
      
      const isTryingToAccessRestricted = restrictedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isTryingToAccessRestricted && verificationStatus !== "APPROVED") {
        return NextResponse.redirect(new URL("/verify", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Fail safe for build-time generation
    return NextResponse.next();
  }
}

export const config = {
  // Matches all routes except api, static files, and internal Next.js files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};