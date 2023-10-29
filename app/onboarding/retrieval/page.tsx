import { auth } from "@clerk/nextjs";
import NavBar from "@/app/components/NavBar";
import RetrievalButton from "@/app/components/OnboardingRetrievalButton";

export default async function RetrievalPage() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  if (!userId || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="flex justify-center py-32 align-center">
        <RetrievalButton userId={userId} token={token} />{" "}
      </div>
    </div>
  );
}
