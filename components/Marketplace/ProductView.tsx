"use client";
import React, { useState } from 'react';
import { 
  MapPin, MessageCircle, ShieldCheck, AlertTriangle, 
  ChevronLeft, Share2, Zap, MessageSquare, Send, 
  Info, Sparkles, ShoppingBag 
} from "lucide-react";
import Link from "next/link";
import { Product, User } from "@prisma/client";

// Define exactly what the product prop looks like with its relations
interface ProductWithSeller extends Product {
  seller: User;
}

interface ProductViewProps {
  product: ProductWithSeller;
  isViewerVerified: boolean;
  sellerWhatsapp: string | null;
}

export function ProductView({ product, isViewerVerified, sellerWhatsapp }: ProductViewProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="bg-[#FCFCFA] min-h-screen pb-20">
      {/* --- TOP NAV --- */}
      <div className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <Link href="/marketplace" className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-[#3A4118] hover:text-white transition-all group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div className="flex gap-3">
          <button className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:scale-105 transition-all">
            <Share2 className="w-5 h-5 text-[#3A4118]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 gap-12 lg:gap-20">
        
        {/* --- LEFT: DYNAMIC GALLERY --- */}
        <div className="lg:w-1/2 w-full space-y-6">
          <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white shadow-2xl border-[10px] border-white group">
            <img 
              src={product.images[activeImg]} 
              className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              alt={product.title}
            />
            {/* Real Price from DB */}
            <div className="absolute bottom-8 right-8 bg-[#3A4118] text-white px-8 py-4 rounded-[2rem] font-black text-xl shadow-2xl shadow-black/20">
               ₦{product.price.toLocaleString()}
            </div>
          </div>

          {/* REAL THUMBNAILS FROM DB */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all p-1 ${
                  activeImg === idx ? 'border-[#3A4118] bg-[#3A4118] scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover rounded-[1.1rem]" alt={`view ${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT: REAL SCOOP & DESCRIPTION --- */}
        <div className="lg:w-1/2 w-full space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="bg-[#A3B18A]/20 text-[#3A4118] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                  {product.category}
               </span>
               <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                  {product.condition}
               </span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-[#3A4118] uppercase tracking-tighter leading-[0.85]">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-2 text-slate-400 pt-2">
               <MapPin className="w-4 h-4 text-[#A3B18A]" />
               <span className="text-xs font-black uppercase tracking-widest">{product.location}</span>
            </div>
          </div>

          {/* --- THE REAL DESCRIPTION (THE JUICE) --- */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-black text-[#3A4118] uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#A3B18A]" /> The Juice
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-tight">
                {product.description || "The seller was too busy being iconic to write a description. Cop it before it's gone. ✌️"}
              </p>
            </div>
            
            {/* Quick Specs Bar */}
            <div className="pt-4 flex gap-6 border-t border-slate-50">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Post Date</span>
                  <span className="text-[10px] font-black text-[#3A4118]">{new Date(product.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Availability</span>
                  <span className="text-[10px] font-black text-[#3A4118]">Immediate</span>
               </div>
            </div>
          </div>

          {/* THE PLUG CARD */}
          <div className="bg-[#3A4118] rounded-[3rem] p-8 text-white shadow-2xl shadow-[#3A4118]/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Sparkles className="w-20 h-20" /></div>
             <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center font-black text-3xl italic border border-white/20">
                    {product.seller.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A3B18A]">The Plug</p>
                    <h4 className="text-xl font-black uppercase flex items-center gap-2">
                        {product.seller.name} <ShieldCheck className="w-5 h-5 text-[#A3B18A] fill-current shadow-lg" />
                    </h4>
                </div>
             </div>
             
             <a 
                href={isViewerVerified && sellerWhatsapp ? `https://wa.me/${sellerWhatsapp.replace(/\D/g, '')}` : "#"}
                className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                  isViewerVerified && sellerWhatsapp
                  ? "bg-[#F4F4F2] text-[#3A4118] hover:bg-white hover:-translate-y-1 active:scale-95 shadow-white/10" 
                  : "bg-white/5 text-white/40 cursor-not-allowed border border-white/10"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isViewerVerified ? "Slide into DMs" : "Verify to Message"}
             </a>
          </div>

          {/* VIBE CHECK (COMMENT BOX) */}
          <div className="space-y-6 pt-6">
            <h3 className="font-black text-[#3A4118] uppercase text-[11px] tracking-[0.3em] flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#A3B18A]" /> Vibe Check
            </h3>
            
            <div className="relative group">
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ask about the gear or drop a review..."
                    className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 pr-20 text-sm font-bold focus:ring-4 focus:ring-[#A3B18A]/10 outline-none min-h-[140px] shadow-sm italic text-[#3A4118] transition-all"
                />
                <button className="absolute bottom-6 right-6 p-4 bg-[#3A4118] text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-[#3A4118]/20 group-hover:bg-black">
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/20">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No vibes yet. Be the first to comment.</p>
            </div>
          </div>

          <div className="flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity pt-10 border-t border-slate-100">
             <button className="flex items-center gap-2 text-red-500 group cursor-pointer">
                <AlertTriangle className="w-4 h-4 group-hover:animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest">Report Scam</span>
             </button>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DROP REF: {product.id.slice(-8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}