import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.verificationStatus !== "APPROVED") {
    return NextResponse.json({ error: "Unauthorized. Please get verified first." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, category, location, images, condition, whatsappNumber } = body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price.toString()),
        category,
        location,
        images,
        condition,
        whatsappNumber,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT_CREATE_ERROR", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}