"use client";

import { useState, useRef } from "react";
import { Loader2, ArrowLeft, Sparkles, Upload, Check, X, Tag, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "syntra_preset"); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/doitcl4eg/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) setImageUrl(data.secure_url);
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/founders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white mb-12">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: IMAGE PREVIEW */}
          <div className="space-y-6">
            <h1 className="text-4xl font-black uppercase italic leading-none shadow-text">New <br/> <span className="text-[#A3B18A]">Drop.</span></h1>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
                ${imageUrl ? 'border-white bg-white/5' : 'border-white/20 hover:bg-white/5'}
              `}
            >
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              {isUploading ? <Loader2 className="animate-spin" /> : imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" alt="Product" />
              ) : (
                <div className="text-center p-8">
                  <Upload className="mx-auto mb-4 opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Upload Product Shot</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <form className="space-y-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Item Name</label>
                <input required placeholder="E.G. 'DARK MATTER HOODIE'" className="w-full bg-transparent border-b border-white/20 py-2 outline-none font-bold uppercase focus:border-[#A3B18A] transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Price ($)</label>
                  <div className="flex items-center gap-2 border-b border-white/20 focus-within:border-[#A3B18A]">
                    <DollarSign className="w-3 h-3 text-white/40" />
                    <input type="number" placeholder="0.00" className="w-full bg-transparent py-2 outline-none font-bold uppercase" />
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Category</label>
                  <select className="w-full bg-transparent border-b border-white/20 py-2 outline-none font-bold uppercase cursor-pointer">
                    <option className="bg-[#1A1A1A]">Apparel</option>
                    <option className="bg-[#1A1A1A]">Accessory</option>
                    <option className="bg-[#1A1A1A]">Digital</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Description</label>
                <textarea rows={3} placeholder="Tell the story of this piece..." className="w-full bg-transparent border border-white/10 rounded-xl p-3 outline-none text-xs font-medium focus:border-[#A3B18A]" />
              </div>
            </div>

            <button disabled={isUploading || loading} className="w-full bg-[#A3B18A] text-[#1A1A1A] py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95">
              Confirm Drop <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}