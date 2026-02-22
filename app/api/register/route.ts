import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash Password
    const hashed = await bcrypt.hash(password, 12);

    // 3. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Create User & OTP in a Transaction
    // This ensures either both are created or none are.
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          hashedPassword: hashed, // Matches your 'hashedPassword' schema field
          verificationStatus: "UNVERIFIED",
        },
      });

      await tx.otpCode.create({
        data: {
          email,
          code: otpCode,
          expiresAt,
          userId: newUser.id, // Links to the User relation in your schema
        },
      });
    });

    // 5. Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 6. Send the Email
    await transporter.sendMail({
      from: `"Syntra Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - Syntra",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3A4118;">Welcome to Syntra!</h2>
          <p>You're almost there. Use the code below to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px;">
            <h1 style="margin: 0; letter-spacing: 10px; font-family: monospace; color: #3A4118;">${otpCode}</h1>
          </div>
          <p style="margin-top: 20px; font-size: 0.9rem; color: #666;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 201 });

  } catch (error: unknown) {
    // TypeScript safe error handling to remove the red 'any' underline
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("REGISTRATION_ERROR:", errorMessage);

    return NextResponse.json(
      { error: "Registration failed. Please try again." }, 
      { status: 500 }
    );
  }
}