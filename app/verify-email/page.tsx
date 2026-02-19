"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "@/components/OtpInput"; // The component I sent you earlier

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Email verified! You can now sign in.");
        router.push("/signin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Verify your Email</h1>
      <p className="mb-6 text-gray-600">Enter the 6-digit code sent to <b>{email}</b></p>
      
      <OtpInput onComplete={handleVerify} />

      {loading && <p className="mt-4 text-blue-500">Checking code...</p>}
      {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}