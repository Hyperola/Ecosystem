import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
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
          prompt: "select_account",
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

        // Return user object - TypeScript now knows these fields exist
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verificationStatus: user.verificationStatus,
          whatsapp: user.whatsapp,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin", // Redirect to signin on error
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Pass database fields into the JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.verificationStatus = user.verificationStatus;
        token.whatsapp = user.whatsapp;
      }
      
      // Handle manual session updates (e.g., after verification)
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass JWT data into the client-side session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.verificationStatus = token.verificationStatus;
        session.user.whatsapp = token.whatsapp;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is exactly the sign-in page or contains an error, send to dashboard/home
      if (url.includes("/signin")) return `${baseUrl}/dashboard`;
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};