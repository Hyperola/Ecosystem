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
    // Added .startsWith("/signin") so that /signin/email is allowed
    const isPublicRoute = 
      pathname === "/" || 
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify-email") ||
      pathname.startsWith("/signin") || 
      pathname.startsWith("/marketplace") || 
      pathname.startsWith("/explore");

    // 2. AUTH PAGE CHECK (Signin)
    // Prevent logged-in users from seeing any signin-related pages
    if (pathname.startsWith("/signin")) {
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

    // 4. VERIFICATION LOCK
    if (token) {
      const verificationStatus = token.verificationStatus;
      
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
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};