"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, X, Loader2, MapPin, Camera, 
  ShieldCheck, ChevronRight, MessageCircle, Zap 
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

const CATEGORIES = ["Electronics", "Books", "Fashion", "Home", "Services", "Other"];
const CONDITIONS = ["Brand New / Sealed", "Like New / Mint", "Gently Used", "Well Loved"];

export default function CreateProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Electronics",
    location: "",
    description: "",
    condition: "Gently Used",
    whatsappNumber: "",
  });

  // Handle Protection, Redirects & Automatic WhatsApp Pre-fill
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/verify");
    } else if (session) {
      // 1. Ensure user is approved
      if (session.user.verificationStatus !== "APPROVED") {
        router.push("/verify");
      } 
      // 2. Pre-fill WhatsApp number from profile if form is currently empty
      else if (session.user.whatsapp && !formData.whatsappNumber) {
        setFormData((prev) => ({
          ...prev,
          whatsappNumber: session.user.whatsapp as string,
        }));
      }
    }
  }, [session, status, router, formData.whatsappNumber]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCFA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3A4118]" />
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert("Drop at least one photo of the gear!");
      return;
    }

    if (isUploadingImages) {
      alert("Please wait for your images to finish uploading.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: images,
        }),
      });

      if (response.ok) {
        router.push("/marketplace");
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create listing.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA] pb-24 text-slate-900">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src="/create-hero.jpg" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-75"
          alt="Marketplace Culture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCFCFA] via-[#FCFCFA]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/30">
              <Zap className="w-3 h-3 fill-white" />
              New Listing
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#3A4118] uppercase leading-[0.8]">
                DROP YOUR <br /> 
                <span className="italic font-serif font-light text-slate-800">GRAILS.</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Media Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-end justify-between px-2">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#3A4118]">Visual Proof</h2>
                <span className="text-[10px] font-bold text-slate-400">{images.length} / 4 PHOTOS</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-xl border-4 border-white bg-slate-200">
                    <img src={url} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 4 && (
                  <div className={`aspect-[3/4] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center bg-white transition-all relative ${isUploadingImages ? 'border-amber-400 bg-amber-50' : 'border-slate-300 hover:border-[#3A4118]'}`}>
                    {isUploadingImages ? (
                      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Angle</span>
                      </>
                    )}
                    <UploadButton<OurFileRouter, "productImage">
                      endpoint="productImage"
                      onUploadBegin={() => setIsUploadingImages(true)}
                      onClientUploadComplete={(res) => {
                        setIsUploadingImages(false);
                        // Using ufsUrl to avoid deprecation warnings
                        if (res) setImages([...images, ...res.map(f => f.ufsUrl)]);
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploadingImages(false);
                        alert(error.message);
                      }}
                      appearance={{
                        button: "absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed",
                        allowedContent: "hidden"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-[#3A4118] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <ShieldCheck className="w-12 h-12 mb-4 opacity-20 absolute -right-2 -top-2 rotate-12" />
                <h3 className="font-black text-sm uppercase tracking-widest mb-2">Seller Vibe Check</h3>
                <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
                    Syntra is high-trust. Be honest about condition to maintain your rating.
                </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 space-y-10 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="space-y-12">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Item Name</label>
                <input 
                  required
                  value={formData.title}
                  type="text"
                  placeholder="e.g. Vintage Varsity Jacket"
                  className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#3A4118] outline-none transition-all py-3 text-2xl font-black"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Price (₦)</label>
                  <input 
                    required
                    value={formData.price}
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#3A4118] outline-none transition-all py-3 text-xl font-bold"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                  <select 
                    value={formData.category}
                    className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#3A4118] outline-none transition-all py-3 font-bold text-slate-600 appearance-none"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Condition</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({...formData, condition: cond})}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        formData.condition === cond 
                        ? "bg-[#3A4118] border-[#3A4118] text-white" 
                        : "bg-white border-slate-100 text-slate-400"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group p-6 bg-green-50 rounded-[2rem] border-2 border-green-100">
                <label className="flex items-center gap-2 text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">
                  <MessageCircle className="w-4 h-4" /> 
                  WhatsApp Number
                </label>
                <input 
                  required
                  value={formData.whatsappNumber}
                  type="tel"
                  placeholder="080..."
                  className="w-full bg-transparent outline-none py-2 text-xl font-bold text-green-900"
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-[#3A4118] w-4 h-4" />
                  <input 
                    required
                    value={formData.location}
                    type="text"
                    placeholder="e.g. Jaja Hall Gate"
                    className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#3A4118] outline-none transition-all py-3 pl-7 font-bold"
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Details</label>
                <textarea 
                  required
                  value={formData.description}
                  rows={3}
                  placeholder="Describe your item..."
                  className="w-full bg-[#FCFCFA] border-2 border-slate-100 rounded-[2rem] focus:border-[#3A4118] outline-none transition-all p-6 font-medium"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button
              disabled={loading || isUploadingImages}
              type="submit"
              className="w-full py-6 bg-[#3A4118] text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  DEPLOY LISTING
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}