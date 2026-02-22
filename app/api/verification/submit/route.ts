import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificationStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // 1️⃣ Check authentication
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in again." },
        { status: 401 }
      );
    }

    // 2️⃣ Prevent duplicate submissions
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
        { error: "A verification request is already pending or approved." },
        { status: 400 }
      );
    }

    // 3️⃣ Read form data
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const institution = formData.get("institution") as string;
    const matricOrNysc = formData.get("matricOrNysc") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const file = formData.get("idImage") as File | null;

    // DEBUG LOGGING: This helps you find exactly which field is null in your terminal
    if (!fullName || !institution || !matricOrNysc || !whatsapp || !file || file.size === 0) {
      console.log("❌ Validation Failed:", {
        fullName: !!fullName,
        institution: !!institution,
        matricOrNysc: !!matricOrNysc,
        whatsapp: !!whatsapp,
        fileReceived: !!file,
        fileSize: file?.size || 0,
      });

      return NextResponse.json(
        { error: "All fields are required, including a valid ID image." },
        { status: 400 }
      );
    }

    // 4️⃣ Upload ID image to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "syntra-verification-ids",
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                console.error("Cloudinary Error:", error);
                reject(error || new Error("Upload failed"));
              } else {
                resolve(result as { secure_url: string });
              }
            }
          )
          .end(buffer);
      }
    );

    // 5️⃣ Transaction: Create request & update user status simultaneously
    // This ensures either BOTH succeed or BOTH fail (no partial data)
    await prisma.$transaction([
      prisma.verificationRequest.create({
        data: {
          userId: session.user.id,
          fullName,
          institution,
          matricOrNysc,
          whatsapp,
          idImageUrl: uploadResult.secure_url,
          status: VerificationStatus.PENDING,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { verificationStatus: VerificationStatus.PENDING },
      }),
    ]);

    // 6️⃣ Success response
    return NextResponse.json({
      success: true,
      message: "Vibe check initiated. We'll review your ID shortly.",
    });

  } catch (error: any) {
    console.error("Verification Submission Error:", error);
    
    // Detailed error for Cloudinary or Prisma issues
    return NextResponse.json(
      { error: error.message || "Something went wrong during submission." },
      { status: 500 }
    );
  }
}