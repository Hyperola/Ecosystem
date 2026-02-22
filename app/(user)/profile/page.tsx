import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // 1. Handle unauthenticated state
  if (!session || !session.user?.email) {
    redirect("/api/auth/signin");
  }

  // 2. Fetch user with Products AND Businesses (including product counts)
  // We use the email from the session to find the unique user record
  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    },
    include: {
      // Fetch user's personal marketplace items
      products: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      // Fetch user's Brand Pages for the profile sidebar
      businesses: {
        include: {
          _count: {
            select: { products: true } // Shows how many items are linked to this brand
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  // 3. Handle cases where session exists but user isn't in DB
  if (!user) {
    return notFound();
  }

  // 4. Pass the data to the client component
  // We cast to 'any' to ensure the complex Prisma include matches your ProfileClient interface
  return <ProfileClient user={user as any} />;
}