"use client";
import React, { useState, useRef, useMemo } from 'react';
import { 
  Camera, Settings, Package, ShieldCheck, 
  ExternalLink, LogOut, Plus, Zap, 
  Crown, Flame, Globe, ArrowUpRight, Loader2, X, Check, Sparkles,
  Trash2, ShoppingBag, ChevronLeft, ChevronRight, Store, LayoutDashboard
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, Product, VerificationStatus, Business } from "@prisma/client";

// Define the Extended Business type to include the product count
interface ExtendedBusiness extends Business {
  _count?: {
    products: number;
  };
}

// FIX: Removed the '?' from bio and whatsapp to match Prisma's 'string | null' exactly
interface ExtendedUser extends User {
  bio: string | null;
  whatsapp: string | null;
  products: Product[];
  businesses: ExtendedBusiness[];
}

interface ProfileClientProps {
  user: ExtendedUser | null;
}

const AVATAR_STYLES = ["pixel-art", "avataaars", "bottts", "adventurer", "lorelei"];
const ITEMS_PER_PAGE = 6;

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [bio, setBio] = useState(user?.bio || "");
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || "");

  // --- CORE DATABASE UPDATE LOGIC ---
  const updateUserData = async (payload: any) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/update-details", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        return true;
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  // --- PRODUCT STATUS HANDLERS ---
  const toggleSoldStatus = async (productId: string, currentStatus: boolean) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold: !currentStatus }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setUser((prev) => prev ? {
          ...prev,
          products: prev.products.map(p => 
            p.id === productId ? { ...p, isSold: updatedProduct.isSold } : p
          )
        } : null);
      }
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Delete this drop?")) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (response.ok) {
        setUser((prev) => prev ? {
          ...prev,
          products: prev.products.filter(p => p.id !== productId)
        } : null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateUserData({ imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const pickAvatarStyle = (style: string) => {
    const seed = Math.random().toString(36).substring(7);
    const newUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    updateUserData({ imageUrl: newUrl });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUserData({ bio, whatsapp });
    if (success) setShowEditModal(false);
  };

  // Pagination Logic
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return user?.products?.slice(start, start + ITEMS_PER_PAGE) || [];
  }, [user?.products, currentPage]);

  const totalPages = Math.ceil((user?.products?.length || 0) / ITEMS_PER_PAGE);
  const productCount = user?.products?.length || 0;
  const activeProducts = user?.products?.filter(p => !p.isSold).length || 0;
  const xpPercentage = Math.min(productCount * 10, 100); 

  return (
    <div className="bg-[#FCFCFA] min-h-screen pb-24 selection:bg-[#A3B18A] selection:text-white">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[90]">
        <Link href="/marketplace/create" className="flex items-center justify-center w-14 h-14 bg-[#3A4118] text-white rounded-2xl shadow-2xl active:scale-90 transition-transform">
          <Plus className="w-8 h-8" />
        </Link>
      </div>

      {/* --- HERO HEADER --- */}
      <div className="h-48 md:h-64 bg-[#3A4118] relative overflow-hidden text-left">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <div className="text-[18vw] md:text-[15vw] font-black text-white italic tracking-tighter uppercase select-none leading-none">SYNTRA</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-end pb-8 md:pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 w-full">
            <div className="relative group">
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] bg-white border-[4px] md:border-[8px] border-[#FCFCFA] overflow-hidden shadow-2xl relative">
                {isUpdating && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                <img 
                  src={user?.image || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.name}`} 
                  className="w-full h-full object-cover" 
                  alt="Profile"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="absolute -bottom-1 -right-1 p-2 md:p-3 bg-black text-white rounded-xl md:rounded-2xl border-2 md:border-4 border-[#FCFCFA] shadow-xl hover:scale-110 active:scale-95 transition-all z-30"
              >
                <Camera className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex-grow mb-2 md:mb-4">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                  {user?.name?.split(' ')[0] || "PLUG"}
                </h1>
                {user?.verificationStatus === VerificationStatus.APPROVED && (
                  <div className="bg-[#A3B18A] p-1 rounded-full shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>
              <p className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-[0.2em] mb-4 max-w-xs md:max-w-md mx-auto md:mx-0 text-center md:text-left">
                {user?.bio || "No bio set... ⚡️"}
              </p>
              
              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                {AVATAR_STYLES.map((style) => (
                  <button key={style} onClick={() => pickAvatarStyle(style)} className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-all overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/${style}/svg?seed=${style}`} alt="style" />
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex gap-3 mb-4">
               <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10">
                 <LayoutDashboard className="w-4 h-4" /> Hub
               </Link>
               <Link href="/marketplace/create" className="bg-[#A3B18A] hover:bg-white hover:text-[#3A4118] text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl">
                 <Plus className="w-4 h-4" /> Drop Gear
               </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: VAULT --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h3 className="font-black text-[#3A4118] uppercase text-xl md:text-2xl tracking-tighter italic leading-none">The Vault</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {activeProducts} ACTIVE / {productCount - activeProducts} SOLD
              </p>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black uppercase text-slate-400">{currentPage}/{totalPages}</span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <div key={p.id} className={`bg-white border border-slate-100 p-3 rounded-[1.8rem] flex flex-col gap-3 transition-all group relative ${p.isSold ? 'opacity-70' : 'hover:border-[#3A4118]'}`}>
                  <div className="aspect-square rounded-[1.3rem] overflow-hidden bg-slate-100 relative shadow-inner">
                     {/* FIX: Using images[0] and p.title */}
                     <img 
                        src={p.images[0] || "/placeholder.jpg"} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${!p.isSold && 'group-hover:scale-105'}`} 
                        alt={p.title} 
                      />
                     
                     {p.isSold && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                         <span className="text-white font-black text-[10px] md:text-xs border-2 border-white/80 px-2 py-0.5 rounded-lg -rotate-12 uppercase">Sold Out</span>
                       </div>
                     )}

                     <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black uppercase shadow-sm">
                       ₦{p.price.toLocaleString()}
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 px-1 text-left">
                    <div>
                      {/* FIX: Using p.title */}
                      <p className={`font-black uppercase text-[10px] tracking-tight truncate ${p.isSold ? 'text-slate-400' : 'text-[#3A4118]'}`}>{p.title}</p>
                      <p className="text-[7px] font-black text-[#A3B18A] uppercase tracking-tighter">{p.category}</p>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => toggleSoldStatus(p.id, !!p.isSold)}
                        className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${p.isSold ? 'bg-[#3A4118] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        title={p.isSold ? "Mark as Active" : "Mark as Sold"}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        className="px-2.5 py-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center flex flex-col items-center justify-center bg-white/50">
                <Package className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No drops found.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: BENTO STATUS --- */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6 text-left">
          {/* XP Card */}
          <div className="bg-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 text-white relative overflow-hidden group shadow-xl">
            <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-[#A3B18A] opacity-20" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <Crown className="w-6 h-6 text-[#A3B18A]" />
                <div className="text-right">
                   <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Current Rank</p>
                   <p className="text-lg font-black italic tracking-tighter uppercase">
                    {productCount >= 5 ? "Elite Plug" : "Campus Plug"}
                   </p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-end mb-1.5">
                   <span className="text-3xl font-black italic tracking-tighter">LVL 1</span>
                   <span className="text-[9px] font-black text-[#A3B18A] uppercase">XP: {productCount}/10</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-[#A3B18A] rounded-full transition-all duration-1000" 
                      style={{ width: `${xpPercentage}%` }} 
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Business Pages Section */}
          <div className="bg-[#E9E9E2] rounded-[2.5rem] p-6 border border-slate-200 shadow-inner">
             <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-[10px] font-black text-[#3A4118] uppercase tracking-[0.2em]">My Pages</h3>
               <Link href="/founders/create" className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform">
                 <Plus className="w-3 h-3 text-[#3A4118]" />
               </Link>
             </div>
             
             <div className="space-y-3">
               {user?.businesses && user.businesses.length > 0 ? (
                 user.businesses.map(biz => (
                   <div key={biz.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 group hover:border-[#3A4118] transition-all">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                        {biz.logo ? <img src={biz.logo} className="w-full h-full object-cover" alt="" /> : <Store className="w-full h-full p-2 text-slate-200" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-[#3A4118] uppercase truncate">{biz.name}</p>
                        <p className="text-[8px] font-bold text-[#A3B18A] uppercase tracking-tighter">{biz._count?.products || 0} Products</p>
                      </div>
                      <Link 
                        href={`/founders/dashboard/${biz.id}`} 
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-[#3A4118] text-white rounded-xl transition-all shadow-lg active:scale-95"
                      >
                        <LayoutDashboard className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Manage</span>
                      </Link>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-6">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">No brand pages yet.</p>
                 </div>
               )}
             </div>
          </div>

          {/* Settings Actions */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-3 border border-slate-100 shadow-sm space-y-1">
             <button onClick={() => setShowEditModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                <span className="text-[9px] font-black text-[#3A4118] uppercase tracking-widest">Edit Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3A4118]" />
             </button>
             <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-2xl transition-all group">
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Logout</span>
                <LogOut className="w-3.5 h-3.5 text-red-400" />
             </button>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#FCFCFA] w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <form onSubmit={handleFormSubmit} className="p-8 md:p-12 space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#3A4118] uppercase tracking-tighter italic">Edit Plug</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Update your presence</p>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#3A4118] uppercase tracking-widest ml-1">WhatsApp</label>
                  <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="234..." className="w-full bg-white border border-slate-200 rounded-xl p-3.5 font-bold focus:border-[#A3B18A] outline-none transition-all text-sm text-[#3A4118]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#3A4118] uppercase tracking-widest ml-1">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="The campus is listening..." className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 font-bold focus:border-[#A3B18A] outline-none transition-all min-h-[100px] resize-none text-sm text-[#3A4118]" />
                </div>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-[#3A4118] text-white py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50">
                {isUpdating ? <Loader2 className="animate-spin w-5 h-5" /> : <><Check className="w-5 h-5" /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}