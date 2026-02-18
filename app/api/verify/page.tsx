import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import VerifyForm from "./verify-form";

export default async function VerifyPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.verificationStatus === "APPROVED") {
    redirect("/dashboard");
  }

  if (session.user.verificationStatus === "PENDING") {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <h1 className="text-2xl font-semibold mb-3">
          Verification under review ⏳
        </h1>
        <p className="text-gray-600">
          We’re reviewing your details. You’ll be notified once approved.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">
        Verify your account
      </h1>
      <p className="text-gray-600 mb-6">
        Please submit your student or NYSC details to unlock all features.
      </p>
      <VerifyForm />
    </div>
  );
}
