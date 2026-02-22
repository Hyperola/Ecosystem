"use client";

import { useState } from "react";
import { Home, Zap, Droplets, MapPin, Camera, Sparkles } from "lucide-react";

export default function ListPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter italic uppercase text-[#3A4118]">
          List a <span className="text-blue-600">Crib</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
          Help a student find a home. Verified listings only.
        </p>
      </div>

      <form className="space-y-8 bg-white border-2 border-[#3A4118] rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_rgba(58,65,24,1)]">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Basic Specs</label>
          <input 
            type="text" 
            placeholder="Hostel Name (e.g., Diamond Villa)" 
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#3A4118] outline-none font-bold"
          />
          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 rounded-xl border border-slate-200 font-bold outline-none">
              <option>Self Contain</option>
              <option>Single Room</option>
              <option>Flat (2-3 Bedroom)</option>
            </select>
            <input 
              type="number" 
              placeholder="Price per Year (₦)" 
              className="p-4 rounded-xl border border-slate-200 font-bold outline-none"
            />
          </div>
        </div>

        {/* Section 2: The "Vitals" (The Gen-Z Student Needs) */}
        <div className="bg-[#F8FAFC] p-6 rounded-3xl space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">The Vitals</label>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#3A4118]">
                <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-black uppercase tracking-tight">Light Rating</span>
              </div>
              <input type="range" min="1" max="5" className="w-full accent-[#3A4118]" />
              <div className="flex justify-between text-[8px] font-black text-slate-400">
                <span>NEPA ONLY</span>
                <span>24/7 STEADY</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#3A4118]">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-tight">Proximity</span>
              </div>
              <select className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-bold">
                <option>Behind Gate</option>
                <option>5 Mins Bike</option>
                <option>10+ Mins Bike</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Features */}
        <div className="grid grid-cols-2 gap-3">
            {["Water Running", "Fenced", "Security Guard", "Personal Meter"].map((tag) => (
                <label key={tag} className="flex items-center gap-2 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-[#3A4118]" />
                    <span className="text-[10px] font-black uppercase text-slate-600">{tag}</span>
                </label>
            ))}
        </div>

        <button className="w-full bg-[#3A4118] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> Deploy Listing
        </button>
      </form>
    </div>
  );
}