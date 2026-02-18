// app/admin/page.tsx
import { prisma } from "@/lib/prisma"; // Adjust based on your prisma client path

export default async function AdminDashboard() {
  // Fetch counts for all categories
  const [userCount, productCount, propertyCount, jobCount, businessCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.property.count(),
    prisma.job.count(),
    prisma.business.count(),
  ]);

  const stats = [
    { name: "Total Users", value: userCount, color: "bg-blue-500" },
    { name: "Marketplace Items", value: productCount, color: "bg-green-500" },
    { name: "Hostel Listings", value: propertyCount, color: "bg-purple-500" },
    { name: "Active Side Quests", value: jobCount, color: "bg-orange-500" },
    { name: "Student Businesses", value: businessCount, color: "bg-pink-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Ecosystem Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
            <div className={`h-1 w-12 mt-4 rounded ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Verifications Needed</h2>
        <p className="text-gray-500">No pending requests. Everything is clean!</p>
      </div>
    </div>
  );
}