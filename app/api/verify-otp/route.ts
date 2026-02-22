// app/api/verify-otp/route.ts
import { prisma } from "@/lib/prisma"; // Add this line
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const otpRecord = await prisma.otpCode.findFirst({
      where: { email, code, expiresAt: { gt: new Date() } },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // ... rest of your code to verify the user
    return NextResponse.json({ message: "Verified successfully" });
    
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}