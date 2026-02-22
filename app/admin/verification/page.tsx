"use client";

import { useState } from "react";
// Import the type we just created
import type { VerificationRequest } from "@/types";


interface VerificationCardProps {
  request: VerificationRequest;
}

export default function VerificationCard({ request }: VerificationCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(request.status);
  const [rejectionNote, setRejectionNote] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verify/${request.id}/approve`, { 
        method: "POST" 
      });
      if (res.ok) setStatus("APPROVED");
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) return alert("Please enter a rejection note");
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verify/${request.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ rejectionNote }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setStatus("REJECTED");
    } catch (error) {
      console.error("Rejection failed", error);
    } finally {
      setLoading(false);
    }
  };

  // If the status is no longer PENDING, we hide the card from the list
  if (status !== "PENDING") return null;

  return (
    <div className="border-2 border-[#3A4118]/5 p-6 rounded-3xl bg-white shadow-sm transition-all hover:shadow-md">
      <div className="space-y-2 mb-4">
        <p className="text-xs font-black text-[#A3B18A] tracking-widest uppercase">User Info</p>
        <p className="font-bold text-[#3A4118]">
          {request.user.name} 
          <span className="text-gray-400 font-normal ml-2">({request.user.email})</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-slate-600">
          <p><span className="font-bold text-[#3A4118]">Full Name:</span> {request.fullName}</p>
          <p><span className="font-bold text-[#3A4118]">Institution:</span> {request.institution}</p>
          <p><span className="font-bold text-[#3A4118]">Matric/NYSC:</span> {request.matricOrNysc}</p>
          <p><span className="font-bold text-[#3A4118]">WhatsApp:</span> {request.whatsapp}</p>
        </div>
      </div>
      
      <a 
        href={request.idImageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block mt-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-[#3A4118] hover:bg-slate-200 transition-colors"
      >
        View ID Image ↗
      </a>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-50 pt-6">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="bg-[#3A4118] text-white py-3 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase disabled:opacity-50 hover:opacity-90 transition-all shadow-lg shadow-[#3A4118]/10"
        >
          {loading ? "Processing..." : "Approve ✓"}
        </button>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Reason for rejection..."
            value={rejectionNote}
            onChange={e => setRejectionNote(e.target.value)}
            className="flex-1 border-2 border-slate-100 px-4 py-3 rounded-2xl text-sm focus:border-red-200 outline-none transition-all"
          />
          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-50 text-red-600 border border-red-100 py-3 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}