"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Lock, 
  Mail, 
  User, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success! Move to OTP verification and pass the email in the URL
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3A4118 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md z-10 py-12">
        <Link href="/signin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#3A4118] mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Terminal
        </Link>

        <div className="bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#A3B18A]" />
                <span className="text-[10px] font-black text-[#A3B18A] uppercase tracking-widest">New Recruit</span>
            </div>
            <h1 className="text-3xl font-black text-[#3A4118] uppercase tracking-tighter italic">Join The Circle<span className="text-[#A3B18A] not-italic">.</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create your student identity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{error}</p>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  required
                  placeholder="Main Character"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-300"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Student Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="email" 
                  required
                  placeholder="vibes@university.edu"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-300"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Access Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold focus:border-[#3A4118] outline-none transition-all placeholder:text-slate-300"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  Initialize Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Already in the circle? <Link href="/signin" className="text-[#3A4118] underline">Login Here</Link>
        </p>
      </div>
    </div>
  );
}