import Link from 'next/link';
import { ShoppingBag, Home, Briefcase, Store, ArrowUpRight, Zap, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#F4F4F2] min-h-screen text-[#3A4118] selection:bg-[#A3B18A] pb-10 overflow-x-hidden">
      
      {/* --- HERO: THE VIBE CHECK --- */}
      <section className="relative pt-12 md:pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="w-full lg:w-1/2 z-20">
              <div className="inline-flex items-center gap-2 bg-[#3A4118] text-white px-4 py-2 rounded-full mb-6 -rotate-2 shadow-xl">
                <Sparkles className="w-3 h-3 text-[#A3B18A]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syntra Unlocked v1.0</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-6 uppercase">
                CAMPUS <br />
                <span className="stroke-text italic font-serif font-light text-6xl md:text-9xl block my-2">LIFESTYLE.</span>
                <span className="text-[#A3B18A]">REFINED.</span>
              </h1>

              <p className="text-slate-500 text-sm md:text-base max-w-sm mb-10 font-bold leading-tight uppercase tracking-tight">
                Stop settling for basic. Secure the drip, the crib, and the side quest. All in one circle.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/marketplace" className="px-8 py-4 bg-[#3A4118] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:rotate-2 transition-all">
                  Enter The Circle
                </Link>
                <div className="flex -space-x-3 items-center">
                    {[1,2,3].map(i => (
                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+99}`} className="w-10 h-10 rounded-full border-4 border-[#F4F4F2] bg-white" alt="" />
                    ))}
                    <span className="pl-5 text-[9px] font-black uppercase text-slate-400">Join 2k+ Students</span>
                </div>
              </div>
            </div>

            {/* Hanging Hero Image */}
            <div className="w-full lg:w-1/2 relative">
               <div className="relative w-full aspect-[4/5] md:aspect-square max-w-[400px] mx-auto rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-6 hover:rotate-0 transition-all duration-700 ease-out bg-slate-200">
                  <img src="/hero-campus.jpg" className="w-full h-full object-cover" alt="Vibe" />
                  <div className="absolute inset-0 bg-[#3A4118]/20 mix-blend-overlay" />
                  <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-white">
                      <p className="font-serif italic text-xl uppercase tracking-tighter">&quot;Main Character Energy&quot;</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: THE PLUG & SIDE QUESTS --- */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
            
            {/* Marketplace: "THE PLUG" */}
            <Link href="/marketplace" className="col-span-2 row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all">
               <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-12 h-12 bg-[#3A4118] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">THE <br />PLUG.</h3>
                    <p className="text-[10px] font-black uppercase text-[#A3B18A] tracking-[0.2em] mt-2">Drip & Tech</p>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-1/2 h-full rotate-6 translate-x-8 group-hover:rotate-0 group-hover:translate-x-0 transition-all duration-500">
                  <img src="/market-vibe.jpg" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
               </div>
            </Link>

            {/* Housing: "THE CRIB" */}
            <Link href="/housing" className="col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-[#3A4118] p-8 shadow-xl transition-all">
                <div className="flex items-center justify-between relative z-10 h-full">
                    <div>
                        <div className="bg-white/10 w-fit px-2 py-1 rounded-md text-white text-[8px] font-black uppercase mb-3">Off-Campus</div>
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">LOCK IN <br />YOUR CRIB.</h3>
                    </div>
                    <ArrowUpRight className="text-[#A3B18A] w-10 h-10" />
                </div>
                <img src="/housing-vibe.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay grayscale" alt="" />
            </Link>

            {/* Side Quest: "THE HUSTLE" */}
            <Link href="/jobs" className="col-span-1 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-6 shadow-sm transition-all">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="bg-[#A3B18A]/20 w-10 h-10 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#3A4118]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none mb-1">SIDE <br />QUESTS.</h3>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quick Cash</p>
                    </div>
                </div>
                <div className="absolute inset-0 z-0">
                    <img src="/jobs-vibe.jpg" className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-60 group-hover:grayscale-0 transition-all" alt="" />
                </div>
            </Link>

            {/* Founder Circle: "THE VISION" */}
            <Link href="/business" className="col-span-1 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-6 shadow-sm transition-all">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="bg-[#3A4118] w-10 h-10 rounded-xl flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none mb-1">FOUNDER <br />MODE.</h3>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Student Biz</p>
                    </div>
                </div>
                <div className="absolute inset-0 z-0">
                    <img src="/biz-vibe.jpg" className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-60 group-hover:grayscale-0 transition-all" alt="" />
                </div>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}