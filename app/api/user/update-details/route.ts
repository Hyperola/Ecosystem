import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { bio, whatsapp, imageUrl } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        bio, 
        whatsapp,
        // We map the 'imageUrl' from the client to the 'image' field in your schema
        ...(imageUrl && { image: imageUrl }), 
      },
      include: {
        products: true, // This ensures the frontend gets the updated product list too
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return new NextResponse("Error updating profile", { status: 500 });
  }
}