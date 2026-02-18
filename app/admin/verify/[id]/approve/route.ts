import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params to get the id
  const { id } = await params;

  try {
    // Update verification request
    const request = await prisma.verificationRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    // Update the user's verification status
    if (request) {
      await prisma.user.update({
        where: { id: request.userId },
        data: { verificationStatus: "APPROVED" },
      });
    }

    return NextResponse.json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Approve Error:", error);
    return NextResponse.json({ error: "Failed to approve user" }, { status: 500 });
  }
}