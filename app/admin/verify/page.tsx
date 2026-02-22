import { prisma } from "@/lib/prisma";
import { Check, X, ExternalLink, Clock, ShieldCheck } from "lucide-react";

export default async function VerifyPage() {
  const requests = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
            Verification <span className="text-blue-600">Queue</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Review matric cards and approve student status.
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 font-black text-xs uppercase">
            {requests.length} Pending
          </span>
        </div>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div 
              key={req.id} 
              className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
            >
              {/* ID Card Image Preview */}
              <div className="md:w-72 h-48 md:h-auto bg-slate-100 relative group">
                <img 
                  src={req.idImageUrl} 
                  alt="Student ID" 
                  className="w-full h-full object-cover"
                />
                <a 
                  href={req.idImageUrl} 
                  target="_blank" 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> VIEW FULL SIZE
                </a>
              </div>

              {/* Request Details */}
              <div className="flex-1 p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <p className="font-bold text-slate-900">{req.fullName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution</label>
                    <p className="font-bold text-slate-900">{req.institution}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric Number</label>
                    <p className="font-bold text-slate-900 tracking-tighter">{req.matricOrNysc}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</label>
                    <p className="font-bold text-slate-900">{req.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Check className="w-4 h-4" /> Approve User
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-100 text-red-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">All caught up!</h3>
          <p className="text-slate-400 text-sm">No new verification requests to process.</p>
        </div>
      )}
    </div>
  );
}