import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Package, Settings, 
  ArrowUpRight, Users, Zap, Globe, Trash2
} from "lucide-react";

export default async function BusinessDashboard({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // 1. Await the params to satisfy Next.js 15/16 requirements
  const { id } = await params;

  const biz = await prisma.business.findFirst({
    where: { 
      id: id,
      ownerId: session.user.id 
    },
    include: {
      products: true,
      _count: { select: { products: true } }
    }
  });

  if (!biz) redirect("/profile");

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#1A1A1A] font-sans pb-20">
      {/* TOP NAV */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
            {biz.logo ? (
              <img src={biz.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Zap className="w-5 h-5 text-[#A3B18A]" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter leading-none">{biz.name}</h2>
            <p className="text-[9px] font-bold text-[#A3B18A] uppercase tracking-[0.2em] mt-1">Founder Command</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Link 
             href={`/founders/${biz.id}`} 
             className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
           >
             View Live <Globe className="w-3.5 h-3.5" />
           </Link>
           <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
             <Settings className="w-4 h-4 text-slate-600" />
           </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3A4118] p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Vault Inventory</p>
            <h3 className="text-6xl font-black italic mt-2 tracking-tighter">{biz._count.products}</h3>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#A3B18A]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Verification Status</p>
              <h3 className="text-2xl font-black uppercase italic mt-1 tracking-tighter text-[#3A4118]">Active Entity</h3>
            </div>
          </div>

          <Link 
            href={`/founders/products/create?bizId=${biz.id}`} 
            className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-[#3A4118] hover:bg-[#3A4118]/5 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-[#3A4118]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#3A4118] mt-4">Drop New Item</span>
          </Link>
        </div>

        {/* PRODUCTS SECTION */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter text-[#3A4118]">The Inventory</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Manage your active goods</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {biz.products.map((product) => (
              <div key={product.id} className="group bg-white rounded-[2.2rem] p-3 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="aspect-[4/5] rounded-[1.8rem] bg-slate-50 mb-4 overflow-hidden relative shadow-inner">
                  {/* 2. FIXED: Accessing images array and using product.title */}
                  <img 
                    src={product.images[0] || "/placeholder.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={product.title} 
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black text-[#3A4118] shadow-sm">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="px-2 pb-2">
                  <h4 className="text-[11px] font-black uppercase truncate tracking-tight">{product.title}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                    <button className="p-2.5 bg-slate-50 rounded-xl hover:bg-black hover:text-white transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {biz.products.length === 0 && (
              <div className="col-span-full py-32 bg-white border-2 border-dashed border-slate-100 rounded-[3.5rem] text-center">
                <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Vault is Empty</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Ready for your first drop?</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}