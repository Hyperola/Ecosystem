"use client";

import { useState } from "react";

export default function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/verification/submit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <p className="text-green-600 text-center">
        ✅ Verification submitted successfully.
        <br />
        We’ll review it shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="fullName"
        placeholder="Full name"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="institution"
        placeholder="Institution / School"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="matricOrNysc"
        placeholder="Matric or NYSC number"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="whatsapp"
        placeholder="WhatsApp number"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="idImage"
        type="file"
        accept="image/*"
        className="w-full"
        required
      />

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit verification"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
