"use client";
import React from 'react';
import { MessageCircle, Lock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  id: string;        // Added ID for navigation
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
  condition: string;
  isVerified: boolean; 
  sellerWhatsapp?: string;
  sellerName?: string; // Optional: show seller name
}

export const ProductCard = ({ 
  id,
  title, 
  price, 
  image, 
  location, 
  category, 
  condition,
  isVerified, 
  sellerWhatsapp,
  sellerName
}: ProductCardProps) => {
  
  const canContact = isVerified && !!sellerWhatsapp;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // IMPORTANT: Stops the Link from firing when clicking the button
    e.preventDefault();
    e.stopPropagation();

    if (!canContact) return;
    const cleanNumber = sellerWhatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Yo! Found your "${title}" on SYNTRA. Still available? ✌️`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <Link href={`/marketplace/${id}`} className="block h-full">
      <div className="group bg-[#FCFCFA] rounded-[2.5rem] border border-[#E5E7EB] p-3 shadow-sm hover:shadow-2xl hover:shadow-[#3A4118]/10 transition-all duration-500 relative flex flex-col h-full">
        
        {/* Location Badge */}
        <div className="absolute top-5 left-5 z-10">
          <div className="bg-[#3A4118] text-[#F4F4F2] text-[8px] font-black px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1 uppercase tracking-tighter">
            <MapPin className="w-2.5 h-2.5 text-[#A3B18A]" />
            {location}
          </div>
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#F4F4F2] mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
          />
          
          <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
            <div className="bg-white/60 backdrop-blur-md border border-white/30 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 w-fit">
              <Sparkles className="w-2.5 h-2.5 text-[#3A4118]" />
              <span className="text-[9px] font-black text-[#3A4118] uppercase tracking-[0.1em]">{category}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow px-2 pb-2">
          <div className="mb-3">
            <h3 className="font-black text-[#3A4118] text-base leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-[#A3B18A] transition-colors">
              {title}
            </h3>
            
            <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3 text-[#A3B18A]" />
                    {sellerName || "Verified Plug"}
                </div>
                <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                  {condition}
                </span>
            </div>
          </div>
          
          {/* Pricing & CTA */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Asking Price</span>
              <p className="text-xl font-black text-[#3A4118] tracking-tighter leading-none">
                ₦{price.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className={`flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-500 z-30 ${
                canContact
                  ? "bg-[#3A4118] text-[#F4F4F2] shadow-lg shadow-[#3A4118]/20 hover:bg-black hover:-translate-y-1 hover:rotate-3 active:scale-90" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed opacity-60"
              }`}
            >
              {canContact ? (
                <MessageCircle className="w-5 h-5 fill-current" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Warning labels removed for cleaner Card - Keep those on the Detail Page */}
        </div>
      </div>
    </Link>
  );
};