"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    const user = session.user;

    // 1. ADMIN HQ
    // Direct access to the command center
    if (user.role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    // 2. AGENT WORKSPACE
    // Agents go directly to their property management dashboard
    if (user.role === "AGENT") {
      router.replace("/agent/dashboard");
      return;
    }

    // 3. STUDENT (USER) FLOW
    // Students must be verified to access the full ecosystem
    if (user.verificationStatus !== "APPROVED") {
      router.replace("/verify");
      return;
    }

    // Normal verified student goes to their main dashboard
    router.replace("/dashboard");
  }, [status, session, router]);

  return null;
}