"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Zap, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  AlertCircle,
  Mail
} from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Success! Send them to sign in
      router.push("/signin?verified=true");
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-2xl mb-4">
            <Mail className="w-6 h-6 text-[#A3B18A]" />
          </div>
          <h1 className="text-3xl font-black text-[#3A4118] uppercase tracking-tighter italic">Check Mail<span className="text-[#A3B18A] not-italic">.</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-4">
            We sent a 6-digit code to <br/>
            <span className="text-[#3A4118] lowercase">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 flex justify-center">Verification Code</label>
            <input 
              type="text" 
              maxLength={6}
              required
              placeholder="000000"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-3xl font-black text-center tracking-[0.5em] focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-200 text-[#3A4118]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button
            disabled={isLoading || otp.length !== 6}
            className="w-full group bg-[#3A4118] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2A3012] transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify Identity
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Didn&apos;t get the code? <br/>
            <button onClick={() => window.location.reload()} className="text-[#3A4118] underline mt-1">Resend Email</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Next.js requires Suspense for useSearchParams in Client Components
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3A4118 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-[#3A4118]" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}