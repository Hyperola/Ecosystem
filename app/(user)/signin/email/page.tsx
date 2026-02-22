"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

// 1. Create a separate component for the form logic to use SearchParams
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#3A4118] uppercase tracking-tighter italic">
          Credentials<span className="text-[#A3B18A] not-italic">.</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Manual override access
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-tight leading-tight">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="email"
              required
              placeholder="name@university.edu"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-2">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-black text-[#A3B18A] uppercase hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          disabled={isLoading}
          className="w-full group bg-[#3A4118] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2A3012] transition-all active:scale-95 disabled:opacity-70 mt-4"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Enter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// 2. The Main Page Component wrapped in Suspense
export default function EmailSignInPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#3A4118 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md z-10">
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#3A4118] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Terminal
        </Link>

        <Suspense fallback={
          <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-10 h-10 animate-spin text-[#3A4118]" />
             <p className="text-[10px] font-black uppercase text-slate-400">Decrypting Access...</p>
          </div>
        }>
          <SignInForm />
        </Suspense>

        <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          New to the circle?{" "}
          <Link href="/register" className="text-[#3A4118] underline">
            Join now
          </Link>
        </p>
      </div>
    </div>
  );
}