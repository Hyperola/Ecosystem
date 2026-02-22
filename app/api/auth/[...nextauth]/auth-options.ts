import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  // Switch to JWT strategy to support Credentials + Social login together
  session: {
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // FIX: Forces Google to ask "Who is signing in?"
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists and has a password (they might have signed up with Google only)
        if (!user || !user.hashedPassword) {
          throw new Error("No user found with this email. Please sign up.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // Return user object for the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as any).role,
          verificationStatus: (user as any).verificationStatus,
          whatsapp: (user as any).whatsapp,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    // newUser: "/verify", // You can redirect first-time users here
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Pass database fields into the JWT token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.verificationStatus = (user as any).verificationStatus;
        token.whatsapp = (user as any).whatsapp;
      }
      
      // Allows manual session updates if you change user data
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass JWT data into the client-side session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.verificationStatus = token.verificationStatus as string;
        session.user.whatsapp = token.whatsapp as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};