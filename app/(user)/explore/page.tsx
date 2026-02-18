import { getAuthSession } from "@/lib/auth";

export default async function ExplorePage() {
  const session = await getAuthSession();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

      {session && session.user?.verificationStatus !== "APPROVED" && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
          ⚠ Your account is {session.user.verificationStatus.toLowerCase()}.
          <a href="/verify" className="underline ml-2 text-blue-600 hover:text-blue-800">
            Verify now
          </a>
        </div>
      )}

      <p>Here you can browse products, businesses, apartments for rent, etc.</p>
      {/* Render marketplace items here */}
    </div>
  );
}
