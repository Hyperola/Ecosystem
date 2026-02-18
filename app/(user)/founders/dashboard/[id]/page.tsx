import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Package, ShoppingBag, Settings, 
  ArrowUpRight, Users, Zap, Globe 
} from "lucide-react";

export default async function BusinessDashboard({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const biz = await prisma.business.findFirst({
    where: { 
      id: params.id,
      ownerId: session.user.id // Security: Ensure they own this biz
    },
    include: {
      products: true,
      _count: { select: { products: true } }
    }
  });

  if (!biz) redirect("/profile");

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A1A] font-sans pb-20">
      {/* TOP NAV */}
      <nav className="p-6 flex justify-between items-center border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden">
            <img src={biz.logo || ""} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-tighter">{biz.name}</h2>
            <p className="text-[8px] font-bold text-[#A3B18A] uppercase tracking-widest">Founder Panel</p>
          </div>
        </div>
        <Link href={`/founders/${biz.id}`} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-black hover:text-white transition-all">
          <Globe className="w-4 h-4" />
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3A4118] p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Drops</p>
            <h3 className="text-5xl font-black italic mt-2">{biz._count.products}</h3>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
            <Users className="w-6 h-6 mb-4 text-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</p>
            <h3 className="text-2xl font-black uppercase italic mt-2">Active Entity</h3>
          </div>

          <Link href={`/founders/products/create?bizId=${biz.id}`} className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-[#3A4118] transition-all">
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-[#3A4118] mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#3A4118]">Add New Product</span>
          </Link>
        </div>

        {/* PRODUCTS SECTION */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Inventory</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manage your active goods</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {biz.products.map((product) => (
              <div key={product.id} className="group bg-white rounded-[2rem] p-4 border border-slate-100 hover:shadow-2xl transition-all">
                <div className="aspect-square rounded-2xl bg-slate-50 mb-4 overflow-hidden relative">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
                <h4 className="text-[10px] font-black uppercase truncate leading-none">{product.name}</h4>
                <div className="flex justify-between items-center mt-4">
                  <button className="text-[8px] font-black uppercase tracking-widest text-red-400 hover:text-red-600">Delete</button>
                  <button className="p-2 bg-slate-50 rounded-lg"><Settings className="w-3 h-3 text-slate-400" /></button>
                </div>
              </div>
            ))}

            {biz.products.length === 0 && (
              <div className="col-span-full py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
                <Package className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase text-slate-400">Your vault is currently empty.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}