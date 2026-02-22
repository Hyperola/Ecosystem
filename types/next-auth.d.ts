import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      verificationStatus: string;
      whatsapp?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth profile or database
   */
  interface User {
    id: string;
    role: string;
    verificationStatus: string;
    whatsapp?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** * Returned by the `jwt` callback and `getToken`, when using JWT sessions 
   */
  interface JWT {
    id: string;
    role: string;
    verificationStatus: string;
    whatsapp?: string | null;
  }
}