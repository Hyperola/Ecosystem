// types/index.ts

import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
  verificationStatus: "UNVERIFIED" | "PENDING" | "APPROVED";
  whatsapp?: string | null;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon; // Uses the actual type from the icon library
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