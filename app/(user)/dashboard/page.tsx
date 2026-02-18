import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Store, 
  Plus, 
  Settings, 
  ShoppingBag, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      businesses: {
        include: {
          _count: { select: { products: true } }
        }
      },
      _count: { select: { products: true, jobs: true } }
    }
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FCFCFA] pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase text-[#3A4118] tracking-tighter">
              The <span className="text-[#A3B18A]">Dashboard</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
              Welcome back, {user.name?.split(' ')[0]}
            </p>
          </div>
          <div className="flex gap-3">
             <Link href="/profile/settings" className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                <Settings className="w-5 h-5 text-slate-400" />
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Business Pages */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#3A4118]">Your Brand Pages</h2>
              {user.businesses.length === 0 && (
                 <Link href="/founders/create" className="text-[10px] font-black text-blue-600 underline uppercase">Create Brand</Link>
              )}
            </div>

            {user.businesses.length > 0 ? (
              <div className="space-y-4">
                {user.businesses.map((business) => (
                  <div key={business.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-[#3A4118] transition-all group">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-5">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                          {business.logo ? (
                            <img src={business.logo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Store /></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-2xl font-black uppercase text-[#3A4118] tracking-tighter">{business.name}</h3>
                             <Link href={`/founders/${business.id}`}><ExternalLink className="w-3 h-3 text-slate-300 hover:text-blue-500" /></Link>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{business.category}</p>
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black text-[#3A4118]"><span className="text-[#A3B18A]">{business._count.products}</span> Items Posted</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link 
                          href={`/marketplace/upload?businessId=${business.id}`}
                          className="px-6 py-4 bg-[#3A4118] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#4d5721] transition-all"
                        >
                          <Plus className="w-4 h-4" /> Post Item
                        </Link>
                        <Link 
                          href={`/founders/edit/${business.id}`}
                          className="px-6 py-4 bg-slate-50 text-[#3A4118] rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-100"
                        >
                          Edit Page
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No brand pages yet.</p>
                <Link href="/founders/create" className="mt-4 inline-block text-[10px] font-black text-[#3A4118] border-b-2 border-[#3A4118] pb-1">LAUNCH YOUR FIRST BRAND</Link>
              </div>
            )}
          </div>

          {/* Right Column: Personal Stats & Quick Links */}
          <div className="space-y-6">
            <div className="bg-[#3A4118] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#3A4118]/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Personal Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-[#A3B18A]" />
                      <span className="text-xs font-bold uppercase">Plug Items</span>
                   </div>
                   <span className="text-xl font-black italic">{user._count.products}</span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <ChevronRight className="w-5 h-5 text-[#A3B18A]" />
                      <span className="text-xs font-bold uppercase">Side Quests</span>
                   </div>
                   <span className="text-xl font-black italic">{user._count.jobs}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3A4118] mb-6">Safety First</h3>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                 Verified brands get higher visibility. Make sure your WhatsApp is always active for customers.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}