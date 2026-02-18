import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params to get the id
  const { id } = await params;

  try {
    // Update VerificationRequest status
    const request = await prisma.verificationRequest.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    // Update user's verification status
    if (request) {
      await prisma.user.update({
        where: { id: request.userId },
        data: { verificationStatus: "REJECTED" },
      });
    }

    return NextResponse.json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Reject Error:", error);
    return NextResponse.json({ error: "Failed to reject user" }, { status: 500 });
  }
}