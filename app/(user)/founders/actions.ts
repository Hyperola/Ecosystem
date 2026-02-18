"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { revalidatePath } from "next/cache";

export async function createBusiness(data: any) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please sign in again." };
  }

  try {
    await prisma.business.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        whatsapp: data.whatsapp,
        instagram: data.instagram || "",
        logo: data.logo || null,
        banner: data.banner || null,
        ownerId: session.user.id,
      },
    });

    revalidatePath("/founders");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("CREATE_BUSINESS_ERROR:", error);
    return { success: false, error: "Failed to create business page." };
  }
}