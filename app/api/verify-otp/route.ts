export async function POST(req: Request) {
  const { email, code } = await req.json();

  const otpRecord = await prisma.otpCode.findFirst({
    where: { email, code, expiresAt: { gt: new Date() } },
  });

  if (!otpRecord) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  // Mark user as verified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  // Delete the code after use
  await prisma.otpCode.delete({ where: { id: otpRecord.id } });

  return NextResponse.json({ message: "Email verified successfully!" });
}