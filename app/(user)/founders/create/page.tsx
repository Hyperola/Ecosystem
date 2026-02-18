"use client";

import { createBusiness } from "../actions";
import { useState, useRef } from "react";
import { Loader2, ArrowLeft, Instagram, Music2, Sparkles, Upload, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBusinessPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  /**
   * HANDLER: Cloudinary Upload
   * Uses your Cloud Name: doitcl4eg
   * Uses your Preset: syntra_preset
   */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "syntra_preset"); 

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/doitcl4eg/image/upload`, 
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await res.json();
      
      if (data.secure_url) {
        setLogoUrl(data.secure_url);
        console.log("Upload Success:", data.secure_url);
      } else {
        console.error("Upload Failed Details:", data);
        alert(`Upload failed: ${data.error?.message || "Check if your preset is 'Unsigned' in Cloudinary."}`);
      }
    } catch (error) {
      console.error("Network upload error:", error);
      alert("Failed to reach Cloudinary. Check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * HANDLER: Form Submission
   * Sends final data to your Server Action
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!logoUrl) return alert("Your brand needs an icon! Upload a logo first. ⚡️");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData);
    
    const res = await createBusiness({ ...rawData, logo: logoUrl });
    if (res.success) {
      router.push("/founders");
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A1A] font-sans selection:bg-[#3A4118] selection:text-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT COLUMN: BRAND VISUALS */}
        <div className="lg:w-[40%] relative min-h-[40vh] lg:h-screen p-8 flex flex-col justify-between text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="/biz-vibe.jpg" 
              className="w-full h-full object-cover" 
              alt="Background Vibe" 
            />
            <div className="absolute inset-0 bg-[#3A4118]/85 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A4118] via-transparent to-black/20" />
          </div>

          <div className="relative z-10">
            <Link href="/founders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-white transition-all mb-8">
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
              The <br /> <span className="text-[#A3B18A]">Drop.</span>
            </h1>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-70">
              Register your entity within the SYNTRA ecosystem.
            </p>
          </div>

          {/* DYNAMIC UPLOAD BOX */}
          <div className="relative z-10 mt-8 lg:mt-0">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`group relative w-36 h-36 md:w-44 md:h-44 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden shadow-2xl
                ${logoUrl ? 'border-white bg-white' : 'border-white/40 bg-white/5 hover:bg-white/20'}
              `}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                  <span className="text-[9px] font-black uppercase text-white tracking-widest">Processing</span>
                </div>
              ) : logoUrl ? (
                <div className="relative w-full h-full p-4 bg-white flex items-center justify-center">
                  <img src={logoUrl} className="max-w-full max-h-full object-contain" alt="Logo Preview" />
                  <div className="absolute top-2 right-2 bg-[#3A4118] rounded-full p-1.5 shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-7 h-7 text-white opacity-80" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-white">Upload Identity</span>
                </div>
              )}
            </button>
            
            {logoUrl && !isUploading && (
              <button 
                type="button"
                onClick={() => setLogoUrl("")}
                className="mt-4 text-[9px] font-black uppercase text-white/50 hover:text-white flex items-center gap-2 transition-colors"
              >
                <X className="w-3 h-3" /> Clear Asset
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DATA ENTRY */}
        <div className="flex-1 p-6 md:p-12 lg:p-16 bg-[#F4F4F2] flex items-center justify-center">
          <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <section className="space-y-4">
                <header className="flex items-center gap-3">
                  <div className="h-[1px] w-6 bg-[#3A4118]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3A4118]">Entity Details</h2>
                </header>

                <div className="grid gap-4">
                  <div className="group bg-white p-4 rounded-2xl border border-slate-200 focus-within:border-[#3A4118] transition-all shadow-sm">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Brand Name</label>
                    <input name="name" required placeholder="E.G. 'SYNTRA LABS'" className="w-full bg-transparent text-lg font-black uppercase outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 focus-within:border-[#3A4118] shadow-sm">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Industry</label>
                      <select name="category" className="w-full bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer">
                        <option>Fashion</option>
                        <option>Food & Drinks</option>
                        <option>Tech & Creative</option>
                        <option>Lifestyle</option>
                      </select>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 focus-within:border-[#3A4118] shadow-sm">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">WhatsApp</label>
                      <input name="whatsapp" required placeholder="Contact No." className="w-full bg-transparent text-[10px] font-black outline-none" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 focus-within:border-[#3A4118] shadow-sm">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Brand Bio</label>
                    <textarea name="description" required rows={2} placeholder="Brief mission statement..." className="w-full bg-transparent text-[10px] font-bold uppercase outline-none resize-none leading-tight" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Digital Presence</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 focus-within:border-[#3A4118] shadow-sm">
                    <Instagram className="w-4 h-4 text-slate-400" />
                    <input name="instagram" placeholder="IG Username" className="flex-1 bg-transparent text-[9px] font-black uppercase outline-none" />
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 focus-within:border-[#3A4118] shadow-sm">
                    <Music2 className="w-4 h-4 text-slate-400" />
                    <input name="tiktok" placeholder="TikTok" className="flex-1 bg-transparent text-[9px] font-black uppercase outline-none" />
                  </div>
                </div>
              </section>

              {/* ACTION BUTTON */}
              <button 
                disabled={loading || isUploading}
                className="w-full group relative overflow-hidden bg-black text-white py-6 rounded-[2rem] shadow-xl hover:shadow-none transition-all duration-500 active:scale-[0.98] disabled:bg-slate-300"
              >
                <div className="relative z-10 flex flex-col items-center">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-black italic uppercase tracking-[0.2em]">Deploy Entity</span>
                       <Sparkles className="w-4 h-4 text-[#A3B18A]" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-[#3A4118] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}