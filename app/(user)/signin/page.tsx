"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import AuthRedirect from "@/app/(user)/(auth)/auth-redirect";
import { Zap, Globe, ShieldCheck, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isVerified = searchParams.get("verified") === "true";
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      {/* Brand Header */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-[#3A4118] rounded-2xl shadow-2xl rotate-[-6deg] mb-6 hover:rotate-0 transition-transform duration-300">
          <Zap className="w-10 h-10 fill-[#A3B18A] text-[#A3B18A]" />
        </Link>
        <h1 className="text-5xl font-black tracking-tighter text-[#3A4118] italic uppercase">
          Syntra<span className="text-[#A3B18A] not-italic">.</span>
        </h1>
        <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-2">
          Secure the bag. Join the circle.
        </p>
      </div>

      {/* Verification Success Message */}
      {isVerified && (
        <div className="mb-6 bg-[#A3B18A]/20 border-2 border-[#A3B18A] p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5 text-[#3A4118]" />
          <p className="text-[10px] font-black uppercase text-[#3A4118] tracking-tight">
            Account Verified! You can now log in.
          </p>
        </div>
      )}

      {/* The Login Card */}
      <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-black text-[#3A4118] uppercase tracking-tight">Access Terminal</h2>
            <p className="text-xs text-slate-500 font-medium italic">Verified student access only.</p>
          </div>

          <div className="space-y-3">
            <button
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-[#3A4118] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-[#2A3012] active:scale-95 disabled:opacity-70"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="google" />
              )}
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              {!isGoogleLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <Link
              href="/signin/email" 
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-50 hover:border-slate-200"
            >
              <Mail className="w-4 h-4" />
              Use Email / Password
            </Link>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#3A4118] underline underline-offset-4 decoration-2 hover:text-[#A3B18A]">
                Register Here
              </Link>
            </p>
          </div>

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
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center relative overflow-hidden px-6">
      <AuthRedirect />
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3A4118 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-[#3A4118]" />}>
        <SignInContent />
      </Suspense>
    </div>
  );
}