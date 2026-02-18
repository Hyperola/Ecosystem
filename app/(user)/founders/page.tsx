import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Instagram, MessageCircle, Globe, Zap, Search, Sparkles, Fingerprint } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export default async function FoundersPage() {
  const session = await getServerSession(authOptions);

  // Fetch all brands with owner info and product counts
  const allBrands = await prisma.business.findMany({
    include: {
      owner: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const CATEGORIES = ["All", "Fashion", "Food", "Tech", "Services", "Art"];

  return (
    <div className="bg-[#FCFCFA] min-h-screen pb-16 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="pt-4 md:pt-10 pb-4 md:pb-6 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl relative">
            <div className="flex flex-col md:flex-row items-stretch">
              
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center z-20 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#3A4118] text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg">
                    FOUNDERS DIRECTORY
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#A3B18A]" />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-[#3A4118] tracking-tighter leading-[0.85] mb-5 md:mb-6 uppercase">
                  DISCOVER THE <br /> 
                  <span className="italic font-serif font-light text-4xl md:text-7xl" style={{ WebkitTextStroke: '1px #3A4118', color: 'transparent' }}>
                    SOURCE.
                  </span>
                </h1>
                
                <p className="text-slate-400 font-bold text-[10px] md:text-sm max-w-sm mb-8 md:mb-10 leading-relaxed uppercase tracking-tight">
                  The ultimate index of student-led entities. Built by the campus, for the campus. Support the local ecosystem. ✌️
                </p>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <Link 
                      href="/founders/create"
                      className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-[#3A4118] text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 h-4" />
                      LAUNCH YOUR PAGE
                    </Link>
                </div>
              </div>

              {/* HERO IMAGE SECTION */}
              <div className="md:w-2/5 relative min-h-[220px] md:min-h-full overflow-hidden bg-slate-50">
                <img src="/market-vibe.jpg" alt="Vibe" className="absolute inset-0 w-full h-full object-cover grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent z-10 hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-4 md:mt-8">
        
        {/* --- FILTERS & SEARCH --- */}
        <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            
            <div className="md:col-span-6 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                placeholder="SEARCH FOR ENTITIES..." 
                className="w-full pl-12 pr-6 py-4 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest"
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-5 py-3 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest border transition-all whitespace-nowrap ${
                    cat === "All" ? "bg-[#3A4118] text-white" : "bg-white text-slate-400 border-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- DIRECTORY GRID --- */}
        {allBrands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allBrands.map((brand) => (
              <div 
                key={brand.id} 
                className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
              >
                {/* Brand Banner / Logo Area */}
                <div className="relative h-40 bg-slate-50 overflow-hidden">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F4F4F2]">
                       <Fingerprint className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border border-white/20">
                    {brand.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-black text-[#3A4118] uppercase tracking-tighter leading-none mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-2">
                      {brand.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-slate-50 mt-auto">
                    <div className="flex-1">
                      <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">FOUNDER</p>
                      <p className="text-[9px] font-black text-[#3A4118] uppercase truncate">{brand.owner.name || "Student Founder"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">VAULT</p>
                      <p className="text-[9px] font-black text-[#3A4118] uppercase">{brand._count.products} ITEMS</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <Link 
                      href={`/founders/${brand.id}`} 
                      className="flex-1 bg-[#3A4118] text-white py-4 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                      ENTER SPACE <ArrowRight className="w-3 h-3" />
                    </Link>
                    {brand.whatsapp && (
                      <a 
                        href={`https://wa.me/${brand.whatsapp}`}
                        target="_blank"
                        className="p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <Fingerprint className="text-slate-200 w-16 h-16 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-[#3A4118] uppercase tracking-tighter">NO ENTITIES DETECTED.</h3>
            <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-widest">The network is currently silent.</p>
          </div>
        )}
      </div>
    </div>
  );
}