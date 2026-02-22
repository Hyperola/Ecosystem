import { MapPin, Zap, Droplets, Search, Filter, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CribPage() {
  // We will eventually fetch this from Prisma
  const sampleHostels = [
    {
      id: "1",
      name: "Emerald Palace",
      price: "250,000",
      type: "Self Contain",
      location: "Behind Gate",
      light: 4,
      water: true,
      image: "https://images.unsplash.com/photo-1555854817-5b2260d1502b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "2",
      name: "Diamond Villa",
      price: "180,000",
      type: "Single Room",
      location: "5 Mins Bike",
      light: 2,
      water: true,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFA] pb-20">
      {/* Header Section */}
      <div className="bg-[#3A4118] pt-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
                The <span className="text-[#A3B18A]">Crib</span>
              </h1>
              <p className="text-[#A3B18A] font-bold text-xs tracking-widest uppercase">
                Find your fortress. Verified campus housing.
              </p>
            </div>
            <Link 
              href="/crib/upload" 
              className="bg-white text-[#3A4118] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 w-fit"
            >
              <Plus className="w-4 h-4" /> List a Property
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar - Floating Tactical Design */}
      <div className="container mx-auto max-w-6xl px-6 -mt-10">
        <div className="bg-white border-2 border-[#3A4118] rounded-[2rem] p-4 shadow-[8px_8px_0px_0px_rgba(58,65,24,1)] flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by hostel name or location..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 text-xs font-bold outline-none border border-transparent focus:border-[#A3B18A]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#3A4118]/5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#3A4118]">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto max-w-6xl px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleHostels.map((hostel) => (
            <div key={hostel.id} className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500">
              {/* Image & Tags */}
              <div className="relative h-64 overflow-hidden">
                <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-[#3A4118]">
                   ₦{hostel.price}/yr
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#3A4118] uppercase tracking-tight">{hostel.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mt-1">
                      <MapPin className="w-3 h-3" /> {hostel.location}
                    </div>
                  </div>
                  <div className="bg-[#A3B18A]/20 text-[#3A4118] px-3 py-1 rounded-lg text-[9px] font-black uppercase">
                    {hostel.type}
                  </div>
                </div>

                {/* Tactical Vitals */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${hostel.light > 3 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} />
                    <span className="text-[10px] font-black uppercase text-slate-500">Light Score: {hostel.light}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className={`w-4 h-4 ${hostel.water ? "text-blue-400 fill-blue-400" : "text-slate-300"}`} />
                    <span className="text-[10px] font-black uppercase text-slate-500">{hostel.water ? "Running Water" : "No Water"}</span>
                  </div>
                </div>

                <Link href={`/crib/${hostel.id}`} className="mt-8 w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl group-hover:bg-[#3A4118] group-hover:text-white transition-colors duration-300">
                  <span className="text-[10px] font-black uppercase tracking-widest">View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}