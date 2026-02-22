"use client";

import { useState } from "react";
import { Upload, CheckCircle, Loader2, Smartphone, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Track the actual file in state so it persists even if the input is unmounted
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Check if we have the file in state
    if (!selectedFile) {
      setError("Please snap or upload your student ID to proceed.");
      setLoading(false);
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // 2. Explicitly append the file from state to ensure it's sent
    formData.set("idImage", selectedFile);

    try {
      const res = await fetch("/api/verification/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Check all fields.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Form Submission Error:", err);
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      setSelectedFile(file); // Save file to state
      
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-8 rounded-[2.5rem] bg-[#FCFCFA] border-2 border-emerald-100 shadow-xl"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-white rounded-full mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-[#3A4118] uppercase tracking-tighter mb-3">Locked In. 🔐</h3>
        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
          We&apos;re checking your credentials. You&apos;ll get full access once the vibe check is complete.
        </p>
        <button 
          onClick={() => window.location.href = "/marketplace"}
          className="w-full py-4 bg-[#3A4118] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          Return to Marketplace
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        
        {/* Full Name */}
        <div className="space-y-1.5 group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="As seen on ID"
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#3A4118] transition-all outline-none text-sm font-bold"
            required
          />
        </div>

        {/* Institution & School Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Campus</label>
            <input
              name="institution"
              type="text"
              placeholder="e.g. UNILAG"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#3A4118] transition-all outline-none text-sm font-bold"
              required
            />
          </div>
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">School Email (Optional)</label>
            <div className="relative">
              <input
                name="schoolEmail"
                type="email"
                placeholder="student@uni.edu.ng"
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#3A4118] transition-all outline-none text-sm font-bold"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>

        {/* ID Number & WhatsApp Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Matric / ID Number</label>
            <input
              name="matricOrNysc"
              type="text"
              placeholder="0000000"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#3A4118] transition-all outline-none text-sm font-bold"
              required
            />
          </div>
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
            <div className="relative">
              <input
                name="whatsapp"
                type="tel"
                placeholder="080..."
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#3A4118] transition-all outline-none text-sm font-bold"
                required
              />
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Identity Upload Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Snap your Student ID</label>
          
          {!previewUrl ? (
            <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center transition-all hover:bg-slate-50 hover:border-[#3A4118] group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                required
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4F4F2] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#3A4118]" />
                </div>
                <p className="text-xs font-black text-[#3A4118] uppercase tracking-widest">Upload ID Card</p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video rounded-[2rem] overflow-hidden border-2 border-[#3A4118]">
              <img src={previewUrl} className="w-full h-full object-cover" alt="ID Preview" />
              <button 
                type="button"
                onClick={clearFile}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#3A4118] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Complete Vibe Check"}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}