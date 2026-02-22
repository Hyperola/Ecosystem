"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  ShoppingBag,
  Zap,
  GraduationCap,
  Sparkles,
  MapPin,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent UI flickering while checking session
  if (status === "loading") {
    return <div className="h-20 bg-[#FCFCFA] border-b border-[#3A4118]/10 sticky top-0 z-50" />;
  }

  /**
   * NAVIGATION LOGIC
   * 1. Guests: Only see HOME.
   * 2. Members: See the 4 Pillars.
   * 3. Verified: See Dashboard.
   * 4. Admin: See HQ.
   */
  const navItems = [
    { href: "/", label: "HOME", icon: Home, show: true },
    { 
      href: "/marketplace", 
      label: "THE PLUG", 
      icon: ShoppingBag, 
      show: !!session?.user // Show only if logged in
    },
    { 
      href: "/crib", 
      label: "THE CRIB", 
      icon: MapPin, 
      show: !!session?.user 
    },
    { 
      href: "/sidequest", 
      label: "SIDE QUEST", 
      icon: Briefcase, 
      show: !!session?.user 
    },
    { 
      href: "/founders", 
      label: "FOUNDERS", 
      icon: Sparkles, 
      show: !!session?.user 
    },
    { 
      href: "/dashboard", 
      label: "DASHBOARD", 
      icon: LayoutDashboard, 
      show: session?.user?.verificationStatus === "APPROVED" 
    },
    { 
      href: "/verify", 
      label: "LOCK IN", 
      icon: Shield, 
      show: session?.user && session.user.verificationStatus !== "APPROVED" && session.user.verificationStatus !== "PENDING"
    },
    { 
      href: "/admin", 
      label: "HQ", 
      icon: GraduationCap, 
      show: session?.user?.role === "ADMIN" 
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-xl border-b border-[#3A4118]/10 py-3" : "bg-[#FCFCFA] py-5"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#3A4118] rounded-xl flex items-center justify-center text-white shadow-xl rotate-[-4deg] group-hover:rotate-0 transition-transform">
              <Zap className="w-6 h-6 fill-[#A3B18A] text-[#A3B18A]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter text-[#3A4118]">SYNTRA</span>
              <span className="text-[8px] font-black tracking-[0.3em] text-[#A3B18A]">COLLECTIVE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.filter(item => item.show).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  isActive(item.href) 
                    ? "bg-[#3A4118] text-white shadow-lg shadow-[#3A4118]/20" 
                    : "text-slate-400 hover:text-[#3A4118] hover:bg-[#3A4118]/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 bg-white p-1 pr-4 rounded-2xl border border-slate-100 hover:border-[#A3B18A] transition-all">
                  <div className="w-9 h-9 bg-[#A3B18A] rounded-xl flex items-center justify-center text-[#3A4118] font-black text-xs shadow-inner uppercase">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-black uppercase text-[#3A4118] tracking-tight">{session.user.name?.split(' ')[0]}</span>
                    <span className={`text-[8px] font-bold tracking-widest uppercase ${
                      session.user.verificationStatus === "APPROVED" 
                        ? "text-[#A3B18A]" 
                        : "text-amber-600 animate-pulse"
                    }`}>
                       {session.user.verificationStatus === "APPROVED" ? "Verified ✓" : "Locked 🔒"}
                    </span>
                  </div>
                </Link>

                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signin" className="text-[10px] font-black uppercase tracking-widest text-[#3A4118]/60 hover:text-[#3A4118]">
                  Login
                </Link>
                <Link
                  href="/signin"
                  className="bg-[#3A4118] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all"
                >
                  Join Circle
                </Link>
              </div>
            )}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-[#3A4118]"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-[#FCFCFA] z-[100] p-6 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
          <div className="space-y-3 pb-20">
            {navItems.filter(item => item.show).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-6 rounded-[2rem] text-2xl font-black italic uppercase tracking-tighter transition-all ${
                  isActive(item.href) 
                    ? "bg-[#3A4118] text-white" 
                    : "bg-white border border-slate-100 text-[#3A4118]"
                }`}
              >
                {item.label}
                <item.icon className="w-6 h-6 opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}