import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user and OTP in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          hashedPassword,
          verificationStatus: "UNVERIFIED",
        },
      });

      // Generate 6-digit code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await tx.otpCode.create({
        data: {
          code: otp,
          email,
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        },
      });

      return { user, otp };
    });

    // 4. Send the Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use an App Password, not your real password
      },
    });

    await transporter.sendMail({
      from: `"Student Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your code is ${result.otp}. It expires in 10 minutes.`,
      html: `<b>Your verification code is: ${result.otp}</b>`,
    });

    return NextResponse.json({ message: "User created. Check your email for the code." });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}