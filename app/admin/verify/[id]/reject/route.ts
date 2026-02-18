import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Update VerificationRequest status
  await prisma.verificationRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  // Update user's verificationStatus
  const request = await prisma.verificationRequest.findUnique({ where: { id } });
  if (request) {
    await prisma.user.update({
      where: { id: request.userId },
      data: { verificationStatus: "REJECTED" },
    });
  }

  return NextResponse.json({ message: "User rejected successfully" });
}
