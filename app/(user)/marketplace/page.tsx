import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { ProductCard } from "@/components/Marketplace/ProductCard";
import { ShoppingBag, Search, Plus, Lock, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const location = typeof resolvedParams.location === "string" ? resolvedParams.location : undefined;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        { isSold: false }, // --- ONLY SHOW ITEMS NOT SOLD ---
        category && category !== "All" ? { category } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        } : {},
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { 
      seller: { 
        select: {
          id: true,
          name: true,
          verificationStatus: true,
          verificationRequests: {
            where: { status: "APPROVED" },
            take: 1
          }
        }
      }
    }
  });

  const session = await getServerSession(authOptions);
  const isViewerVerified = session?.user?.verificationStatus === "APPROVED";
  const CATEGORIES = ["All", "Electronics", "Books", "Fashion", "Home", "Services"];

  return (
    <div className="bg-[#FCFCFA] min-h-screen pb-16 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="pt-4 md:pt-10 pb-4 md:pb-6 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl relative group">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center z-20 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#3A4118] text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg">
                    CAMPUS COLLECTIVE
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#A3B18A]" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-[#3A4118] tracking-tighter leading-[0.85] mb-5 md:mb-6 uppercase">
                  SECURE THE <br /> 
                  <span className="stroke-text italic font-serif font-light text-4xl md:text-7xl">BAG.</span>
                </h1>
                <p className="text-slate-400 font-bold text-[10px] md:text-sm max-w-sm mb-8 md:mb-10 leading-relaxed uppercase tracking-tight">
                  The campus marketplace for the ones who get it. No ghosting, no mid-tier gear, just vibes. ✌️
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                    <Link 
                      href={isViewerVerified ? "/marketplace/create" : "/verify"}
                      className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-[#3A4118] text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                    >
                      {isViewerVerified ? <Plus className="w-3.5 h-3.5 md:w-4 h-4" /> : <Lock className="w-3.5 h-3.5 md:w-4 h-4" />}
                      {isViewerVerified ? "DROP LISTING" : "VERIFY TO SELL"}
                    </Link>
                </div>
              </div>
              <div className="md:w-2/5 relative min-h-[220px] md:min-h-full overflow-hidden bg-slate-50">
                <img src="/market-hero.jpg" alt="Market" className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent z-10 hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-4 md:mt-8">
        
        {/* --- FILTERS --- */}
        <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <form className="md:col-span-5 relative group" action="/marketplace" method="GET">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                name="q"
                defaultValue={query || ""} 
                placeholder="SEARCH FOR GEAR..." 
                className="w-full pl-12 pr-6 py-4 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest"
              />
            </form>

            <form className="md:col-span-3 relative group" action="/marketplace" method="GET">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                name="location"
                defaultValue={location || ""} 
                placeholder="LOCATION..." 
                className="w-full pl-12 pr-6 py-4 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest"
              />
            </form>

            <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={cat === "All" ? "/marketplace" : `/marketplace?category=${cat}`}
                  className={`px-5 py-3 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest border transition-all ${
                    (category === cat || (cat === "All" && !category))
                    ? "bg-[#3A4118] text-white"
                    : "bg-white text-slate-400"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.images[0]}
                location={product.location}
                category={product.category}
                condition={product.condition}
                isVerified={isViewerVerified}
                sellerName={product.seller.name || "Anonymous Plug"}
                sellerWhatsapp={product.seller.verificationRequests[0]?.whatsapp || product.whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <ShoppingBag className="text-slate-200 w-16 h-16 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-[#3A4118] uppercase">THE PLUG IS DRY.</h3>
            <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-widest">Nothing active right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}