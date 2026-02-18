import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Added this
      verificationStatus: string;
      whatsapp?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Added this
    role: string; // Added this
    verificationStatus: string;
    whatsapp?: string | null;
  }
}