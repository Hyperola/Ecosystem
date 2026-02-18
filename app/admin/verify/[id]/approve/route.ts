// app/admin/verify/[id]/approve/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Update verification request
  await prisma.verificationRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  // Update the user's verification status
  const request = await prisma.verificationRequest.findUnique({ where: { id } });
  if (request) {
    await prisma.user.update({
      where: { id: request.userId },
      data: { verificationStatus: "APPROVED" },
    });
  }

  return NextResponse.json({ message: "User approved successfully" });
}
