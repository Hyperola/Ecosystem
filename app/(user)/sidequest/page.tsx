import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { Plus, Search, Sparkles, Zap, MapPin, Clock, ArrowRight, Sword } from "lucide-react";
import Link from "next/link";

export default async function SidequestPage() {
  const session = await getServerSession(authOptions);

  // Example placeholder for sidequests (replace with your prisma.sidequest.findMany later)
  const sidequests = [
    {
      id: "1",
      title: "Need a Graphic Designer for Clothing Brand",
      reward: "₦20,000",
      location: "On-Campus",
      category: "Creative",
      time: "2 days left",
      author: "Slide Gear"
    },
    {
      id: "2",
      title: "Delivery partner for food drops (Main Gate)",
      reward: "₦2,000 / trip",
      location: "Main Gate",
      category: "Logistics",
      time: "Active Now",
      author: "UniEats"
    }
  ];

  const CATEGORIES = ["All", "Creative", "Logistics", "Academic", "Tech", "Other"];

  return (
    <div className="bg-[#FCFCFA] min-h-screen pb-16 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="pt-4 md:pt-10 pb-4 md:pb-6 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-[#3A4118] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <div className="flex flex-col md:flex-row items-stretch">
              
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center z-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/10 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border border-white/10">
                    CAMPUS SIDEQUESTS
                  </span>
                  <Zap className="w-3.5 h-3.5 text-[#A3B18A] fill-current" />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.85] mb-5 md:mb-6 uppercase">
                  START A <br /> 
                  <span className="italic font-serif font-light text-4xl md:text-7xl" style={{ WebkitTextStroke: '1px #A3B18A', color: 'transparent' }}>
                    MISSION.
                  </span>
                </h1>
                
                <p className="text-white/60 font-bold text-[10px] md:text-sm max-w-sm mb-8 md:mb-10 leading-relaxed uppercase tracking-tight">
                  The campus gig economy. Post a task, find a partner, or earn some extra paper. No resumes, just results. ⚔️
                </p>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <Link 
                      href="/sidequest/create"
                      className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-[#A3B18A] text-[#3A4118] rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 h-4" />
                      POST A GIG
                    </Link>
                </div>
              </div>

              {/* HERO IMAGE SECTION */}
              <div className="md:w-2/5 relative min-h-[200px] md:min-h-full overflow-hidden">
                <img src="/market-hero.jpg" alt="Vibe" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3A4118] via-transparent to-transparent z-10 hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-4 md:mt-8">
        
        {/* --- FILTERS --- */}
        <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            
            <div className="md:col-span-5 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                placeholder="FIND A GIG..." 
                className="w-full pl-12 pr-6 py-4 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest"
              />
            </div>

            <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-5 py-3 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest border transition-all whitespace-nowrap ${
                    cat === "All" ? "bg-[#3A4118] text-white" : "bg-white text-slate-400 border-slate-100 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- QUEST LIST --- */}
        <div className="grid grid-cols-1 gap-4">
          {sidequests.map((quest) => (
            <div 
              key={quest.id} 
              className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F4F4F2] rounded-2xl flex items-center justify-center shrink-0">
                  <Sword className="w-6 h-6 text-[#3A4118]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#A3B18A]">{quest.category}</span>
                    <span className="text-slate-200 text-xs">•</span>
                    <div className="flex items-center gap-1 text-slate-400">
                       <MapPin className="w-3 h-3" />
                       <span className="text-[9px] font-bold uppercase">{quest.location}</span>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#3A4118] uppercase tracking-tighter leading-tight group-hover:text-[#A3B18A] transition-colors">
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-4">
                     <p className="text-[10px] font-black uppercase text-slate-300">Posted by {quest.author}</p>
                     <div className="flex items-center gap-1 text-[#3A4118]">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase">{quest.time}</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">REWARD</p>
                  <p className="text-xl md:text-2xl font-black text-[#3A4118] uppercase tracking-tighter">{quest.reward}</p>
                </div>
                <Link 
                  href={`/sidequest/${quest.id}`}
                  className="bg-slate-50 text-[#3A4118] p-4 md:p-5 rounded-2xl hover:bg-[#3A4118] hover:text-white transition-all group/btn shadow-sm"
                >
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {sidequests.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <Sparkles className="text-slate-200 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#3A4118] uppercase">BOARD IS CLEAR.</h3>
            <p className="text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-widest">No active sidequests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}