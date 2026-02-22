import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed process...");

  // 1. Find your specific user
  const user = await prisma.user.findFirst({
    where: { email: "technovaspire@gmail.com" } 
  });

  if (!user) {
    console.error("❌ No user found. Please log in once first or check the email in seed.ts");
    return;
  }

  // 2. Set user as a "Verified Plug"
  console.log(`✅ Approving user: ${user.email}`);
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      verificationStatus: 'APPROVED',
      whatsapp: "2348012345678" // International format is better for wa.me links
    }
  });

  // 3. Create detailed test products with 4 images each
  console.log("📦 Creating test products with galleries...");

  const testProducts = [
    {
      title: "iPhone 15 Pro - Natural Titanium",
      description: "Basically brand new. 256GB, Battery Health 100%. No scratches, just vibes. Comes with a free Spigen case if you're fast. ⚡",
      price: 1550000,
      category: "Electronics",
      location: "Unilag, Jaja Hall",
      condition: "Brand New / Sealed",
      whatsappNumber: "2348012345678",
      sellerId: user.id,
      images: [
        "https://images.unsplash.com/photo-1696446701796-da61225697cc", // Front
        "https://images.unsplash.com/photo-1695668420708-ff92d1920803", // Side
        "https://images.unsplash.com/photo-1695111161201-92b678c43717", // Back
        "https://images.unsplash.com/photo-1695668420235-86646f904f4a"  // Close up camera
      ],
    },
    {
      title: "Vintage Oversized Leather Jacket",
      description: "Found this in a thrift shop in London. Real leather, heavy weight. Perfect for that night-shift aesthetic. Size XL but fits Boxy. 🧥",
      price: 45000,
      category: "Fashion",
      location: "Yabatech, Front Gate",
      condition: "Thrifted / Used",
      whatsappNumber: "2348012345678",
      sellerId: user.id,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5", // Main
        "https://images.unsplash.com/photo-1520975954732-35dd2229969e", // Detail texture
        "https://images.unsplash.com/photo-1551028150-64b9f398f678", // Back
        "https://images.unsplash.com/photo-1490746483401-496df896c827"  // Lifestyle shot
      ],
    }
  ];

  for (const item of testProducts) {
    const product = await prisma.product.create({ data: item });
    console.log(`🚀 Created product: ${product.title}`);
  }

  console.log("✨ Seed successful! Check your Marketplace drop now.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });