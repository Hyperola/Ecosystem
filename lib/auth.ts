import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
