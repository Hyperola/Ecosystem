// app/(user)/layout.tsx
"use client"; // <--- THIS IS CRUCIAL

import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <NavBar />
      <main>{children}</main>
      {/* Add your Footer here too */}
    </SessionProvider>
  );
}