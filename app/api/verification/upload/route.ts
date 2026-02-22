import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getAuthSession } from "@/lib/auth";
import { VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.verificationRequest.findFirst({
    where: {
      userId: session.user.id,
      status: {
        in: [VerificationStatus.PENDING, VerificationStatus.APPROVED],
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Verification already submitted" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("idImage") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "verification-ids",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(result as { secure_url: string });
          }
        }
      )
      .end(buffer);
  });

  return NextResponse.json({
    success: true,
    imageUrl: uploadResult.secure_url,
  });
}
