// app/(agent)/layout.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Home, LogOut } from "lucide-react";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-[#3A4118] text-white p-6 flex flex-col">
          <h2 className="text-2xl font-black italic tracking-tighter mb-10">AGENT HQ.</h2>
          <nav className="space-y-4 flex-1">
            <Link href="/agent/dashboard" className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest opacity-70 hover:opacity-100">
              <LayoutDashboard className="w-4 h-4" /> My Listings
            </Link>
            <Link href="/agent/upload" className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest opacity-70 hover:opacity-100">
              <PlusCircle className="w-4 h-4" /> New Listing
            </Link>
          </nav>
          <Link href="/" className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest pt-6 border-t border-white/10 opacity-70">
            <Home className="w-4 h-4" /> Exit to Site
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}