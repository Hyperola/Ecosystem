"use client";

import { useState, useEffect } from "react";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  institution: string;
  matricOrNysc: string;
  whatsapp: string;
  idImageUrl: string;
  status: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

export default async function AdminVerificationPage() {
  const session = await getAuthSession();

  // Only allow admin
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  // Fetch pending requests server-side
  const pendingRequests = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Pending Verification Requests</h1>

      {pendingRequests.length === 0 ? (
        <p className="text-gray-600">No pending requests right now.</p>
      ) : (
        <div className="space-y-6">
          {pendingRequests.map(request => (
            <VerificationCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

function VerificationCard({ request }: { request: VerificationRequest }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [rejectionNote, setRejectionNote] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    const res = await fetch(`/admin/verify/${request.id}/approve`, { method: "POST" });
    if (res.ok) setStatus("APPROVED");
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) return alert("Please enter a rejection note");
    setLoading(true);
    const res = await fetch(`/admin/verify/${request.id}/reject`, {
      method: "POST",
      body: JSON.stringify({ rejectionNote }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) setStatus("REJECTED");
    setLoading(false);
  };

  if (status !== "PENDING") return null;

  return (
    <div className="border p-4 rounded shadow-sm">
      <p><strong>User:</strong> {request.user.name} ({request.user.email})</p>
      <p><strong>Full Name:</strong> {request.fullName}</p>
      <p><strong>Institution:</strong> {request.institution}</p>
      <p><strong>Matric/NYSC:</strong> {request.matricOrNysc}</p>
      <p><strong>WhatsApp:</strong> {request.whatsapp}</p>
      <p>
        <strong>ID Image:</strong>{" "}
        <a href={request.idImageUrl} target="_blank" className="text-blue-600 underline">View Image</a>
      </p>

      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="bg-green-600 text-white py-1 px-3 rounded"
        >
          {loading ? "Processing..." : "Approve"}
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rejection note"
            value={rejectionNote}
            onChange={e => setRejectionNote(e.target.value)}
            className="border px-2 rounded"
          />
          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 text-white py-1 px-3 rounded"
          >
            {loading ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
