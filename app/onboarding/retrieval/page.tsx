import { auth } from "@clerk/nextjs";
import NavBar from "@/app/components/NavBar";
import RetrievalButton from "@/app/components/OnboardingRetrievalButton";

export default async function RetrievalPage() {
  const { userId, getToken } = auth();
  const authToken = await getToken({ template: "supabase" });
  console.log("got authToken for sub status server side", authToken);
  if (!userId || !authToken) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="flex justify-center py-32 align-center">
        <RetrievalButton userId={userId} authToken={authToken} />{" "}
      </div>
    </div>
  );
}
