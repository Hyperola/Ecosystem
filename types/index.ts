// types/index.ts

import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
  verificationStatus: "UNVERIFIED" | "PENDING" | "APPROVED" | "REJECTED";
  whatsapp?: string | null;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  show: boolean;
  badge?: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  userId: string;
}

/**
 * Verification Request Type
 * Used in Admin Verification Dashboard and Verification Cards
 */
export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  institution: string;
  matricOrNysc: string;
  whatsapp: string;
  idImageUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: Date | string;
  user: {
    name: string | null;
    email: string | null;
  };
}