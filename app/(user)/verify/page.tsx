import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import VerifyForm from "./verify-form";
import Image from "next/image";
import { Sparkles, Camera, Globe, ShieldCheck } from "lucide-react";

export default async function VerifyPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.verificationStatus === "APPROVED") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row overflow-x-hidden relative">
      
      {/* 1. MOBILE TEXTURE OVERLAY (Applies to both sides on small screens) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none grayscale z-0" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />

      {/* 2. FLOATING STICKERS FOR MOBILE */}
      <div className="md:hidden absolute top-6 right-[-10px] rotate-12 bg-[#A3B18A] px-3 py-1 font-black text-[9px] text-[#3A4118] border-2 border-[#3A4118] z-50 shadow-lg uppercase tracking-widest">
          LIVE VIBE CHECK ✌️
      </div>

      {/* LEFT SIDE: The Form */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-6 sm:p-10 md:p-16 z-10">
        <div className="max-w-md w-full relative">
            {/* Tactical Step Indicator for Mobile */}
            <div className="flex gap-1 mb-8 md:hidden">
                <div className="h-1 w-full bg-[#3A4118] rounded-full" />
                <div className="h-1 w-full bg-slate-200 rounded-full" />
                <div className="h-1 w-full bg-slate-200 rounded-full" />
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-[#3A4118] rounded-full flex items-center justify-center">
                        <Globe className="text-white w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-400">Syntra // Secure_Gateway</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-black leading-[0.85] mb-4">
                    VIBE <br />CHECK.
                </h1>
                <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed max-w-[300px]">
                    Verify your ID to join the collective. We&apos;re building the safest campus marketplace in Nigeria.
                </p>
            </div>
          
          <VerifyForm />

          {/* Mobile Secure Footer */}
          <div className="mt-8 flex items-center justify-center gap-4 py-4 border-t border-slate-100 md:hidden">
                <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#A3B18A]" />
                    <span className="text-[8px] font-black uppercase text-slate-400">Encrypted</span>
                </div>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[8px] font-black uppercase text-slate-400">Uni-Scoped Data</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Designer Collage */}
      <div className="hidden md:flex md:w-[55%] bg-[#F3F3F1] relative items-center justify-center p-12 overflow-hidden border-l border-slate-100">
        
        {/* (Keep Desktop logic as is, it's already fire) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-tactical-sage/5 via-transparent to-transparent" />

        <div className="absolute top-12 right-12 rotate-12 bg-[#A3B18A] px-4 py-1.5 font-black text-[10px] text-[#3A4118] border-2 border-[#3A4118] shadow-[4px_4px_0px_0px_rgba(58,65,24,1)] z-40 uppercase tracking-widest">
            Campus Approved ✌️
        </div>

        {/* Small Images */}
        <div className="absolute bottom-16 left-12 -rotate-12 bg-white p-2 border border-slate-200 shadow-2xl z-20 group">
            <div className="bg-slate-100 w-40 h-48 relative mb-2 overflow-hidden">
                 <Image src="/vintage.jpg" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="vintage" />
            </div>
            <p className="text-[9px] font-black text-center uppercase tracking-tighter text-slate-300 font-mono">Archive_001.jpg</p>
        </div>

        <div className="absolute top-16 left-16 rotate-6 bg-white p-2 border border-slate-200 shadow-xl z-10 opacity-70">
            <div className="bg-slate-100 w-36 h-36 relative overflow-hidden">
                 <Image src="/streetwear.jpg" fill className="object-cover" alt="streetwear" />
            </div>
        </div>

        {/* Hero Piece */}
        <div className="relative w-full max-w-lg h-[600px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] font-black stroke-text opacity-10 select-none pointer-events-none z-0 tracking-tighter leading-none uppercase">
                SYNTRA
            </div>

            <div className="relative w-[380px] bg-white p-5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] rotate-1 z-30">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200">
                     <Image src="/analogue.jpg" fill className="object-cover" alt="analogue" priority />
                     <div className="absolute inset-0 bg-army-green/5 mix-blend-overlay pointer-events-none" />
                </div>
                <div className="pt-5 flex justify-between items-center">
                    <div>
                        <span className="font-serif italic text-2xl text-slate-900 block leading-none">session_04</span>
                        <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">ID Verification</span>
                    </div>
                    <Camera className="w-6 h-6 text-slate-200" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-md border border-white/20 -rotate-2 shadow-sm z-40" />
            </div>

            <div className="absolute bottom-10 right-4 w-56 bg-white border-4 border-black p-5 rounded-none rotate-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] z-40">
                <div className="flex gap-1 mb-3">
                    {[1,2,3].map(i => <Sparkles key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-[11px] font-black uppercase leading-[1.1] text-black tracking-tight">
                    Join 5,000+ students swapping grails and building the collective.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}