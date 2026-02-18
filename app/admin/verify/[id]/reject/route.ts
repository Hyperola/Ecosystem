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

    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.verificationRequest.update({
        where: { id },
        data: { status: "REJECTED" },
      });

      const user = await tx.user.update({
        where: { id: request.userId },
        data: { verificationStatus: "REJECTED" },
      });

      return { request, user };
    });

    return NextResponse.json({ message: "User rejected successfully", result });
  } catch (error) {
    console.error("Reject Error:", error);
    return NextResponse.json({ error: "Failed to reject user" }, { status: 500 });
  }
}