import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Use a try-catch to prevent worker crashes during build-time static generation
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // 1. Skip middleware for public assets/auth
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/static") ||
      pathname === "/favicon.ico"
    ) {
      return NextResponse.next();
    }

    // 2. Auth Check
    if (!token) {
      // Allow them to reach signin/register/verify-email
      const isAuthPage = 
        pathname === "/" ||
        pathname.startsWith("/signin") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/verify-email");

      if (isAuthPage) return NextResponse.next();
      
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // 3. Verification Lock
    const verificationStatus = token.verificationStatus;
    const verificationRequiredRoutes = ["/post", "/rent", "/business/create", "/admin"];

    const requiresVerification = verificationRequiredRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (requiresVerification && verificationStatus !== "APPROVED") {
      return NextResponse.redirect(new URL("/verify", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If middleware fails during build, just let it pass to avoid "Call Retries Exceeded"
    return NextResponse.next();
  }
}

export const config = {
  // Use a negative lookahead to exclude files and auth routes
  // This is the "Next.js 16" way to handle matchers
  matcher: ["/((?!api/auth|static|.*\\..*|_next).*)"],
};