import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"; 
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  // 1. Change the type to a Promise
  { params }: { params: Promise<{ productId: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. AWAIT the params here
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product ID Missing", { status: 400 });
    }

    const body = await req.json();
    const { isSold } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.sellerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isSold: !!isSold },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("[PRODUCT_PATCH_ERROR]:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}