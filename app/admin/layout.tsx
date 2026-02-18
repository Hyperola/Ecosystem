import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-options"; // DOUBLE CHECK THIS PATH
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We MUST pass authOptions here to avoid the JWT/Session error
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session) {
    redirect("/signin");
  }

  // 2. Check if their role is ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/"); 
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white p-8 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-3xl font-black tracking-tighter italic">
            SYNTRA<span className="text-blue-500 not-italic">.</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Admin Control
          </p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <AdminLink href="/admin" label="Overview" icon="📈" />
          <AdminLink href="/admin/verify" label="Verifications" icon="✅" />
          <AdminLink href="/admin/plug" label="The Plug" icon="🔌" />
          <AdminLink href="/admin/crib" label="The Crib" icon="🏠" />
          <AdminLink href="/admin/sidequest" label="Side Quest" icon="⚔️" />
          <AdminLink href="/admin/founders" label="Founders" icon="🚀" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
           <Link href="/" className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">
             ← Exit Terminal
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-10 py-4 sticky top-0 z-10 flex justify-between items-center">
            <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest">System / Internal</h1>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{session.user.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Super Admin</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                    <img src={session.user.image || ""} alt="admin" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

        <div className="p-10">
            {children}
        </div>
      </main>
    </div>
  );
}

// Helper component for cleaner code
function AdminLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold text-sm group"
    >
      <span className="group-hover:scale-125 transition-transform">{icon}</span>
      {label}
    </Link>
  );
}