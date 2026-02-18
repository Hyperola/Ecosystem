"use client";

import { signIn } from "next-auth/react";
import AuthRedirect from "@/app/(user)/(auth)/auth-redirect";
import { Zap, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center relative overflow-hidden px-6">
      <AuthRedirect />
      
      {/* Background Decor - The "Grid" Vibe */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3A4118 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3A4118] rounded-2xl shadow-2xl rotate-[-6deg] mb-6">
            <Zap className="w-10 h-10 fill-[#A3B18A] text-[#A3B18A]" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#3A4118] italic uppercase">
            Syntra<span className="text-[#A3B18A] not-italic">.</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-2">
            Secure the bag. Join the circle.
          </p>
        </div>

        {/* The Login Card */}
        <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-[#3A4118] uppercase tracking-tight">Access Terminal</h2>
              <p className="text-xs text-slate-500 font-medium italic">Verified student access only.</p>
            </div>

            <button
              onClick={() => signIn("google")}
              className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-[#3A4118] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-[#2A3012] active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="google" />
              Continue with Google
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
               <div className="flex flex-col items-center gap-1 opacity-40">
                  <Globe className="w-4 h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">Connect</span>
               </div>
               <div className="flex flex-col items-center gap-1 opacity-40">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">Verify</span>
               </div>
               <div className="flex flex-col items-center gap-1 opacity-40">
                  <Zap className="w-4 h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">Trade</span>
               </div>
            </div>
          </div>
        </div>

        {/* Extra Footer Info */}
        <p className="mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
          By entering, you agree to the <br />
          <span className="text-[#3A4118] cursor-pointer hover:underline">Syntra Collective Code of Conduct</span>
        </p>
      </div>
    </div>
  );
}