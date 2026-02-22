import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Use a transaction to ensure both updates succeed or both fail
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.verificationRequest.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      const user = await tx.user.update({
        where: { id: request.userId },
        data: { verificationStatus: "APPROVED" },
      });

      return { request, user };
    });

    return NextResponse.json({ message: "User approved successfully", result });
  } catch (error) {
    console.error("Approve Error:", error);
    return NextResponse.json({ error: "Failed to approve user" }, { status: 500 });
  }
}