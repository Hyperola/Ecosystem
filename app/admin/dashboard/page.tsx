// app/admin/dashboard/page.tsx
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Review and approve verification requests
      </p>
    </div>
  );
}
