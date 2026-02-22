import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { ProductView } from "@/components/Marketplace/ProductView";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Real data fetching
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        include: {
          verificationRequests: { where: { status: "APPROVED" }, take: 1 }
        }
      }
    }
  });

  if (!product) notFound();

  const session = await getServerSession(authOptions);
  const isViewerVerified = session?.user?.verificationStatus === "APPROVED";
  const sellerWhatsapp = product.seller.verificationRequests[0]?.whatsapp || product.whatsappNumber;

  // Passing REAL data to the Client component
  return (
    <ProductView 
      product={product} 
      isViewerVerified={isViewerVerified} 
      sellerWhatsapp={sellerWhatsapp} 
    />
  );
}