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
      <div className="flex flex-col justify-center items-center py-32 align-center">
        <div className="bg-gradient-to-r max-w-lg rounded-3xl from-blue-400 to-yellow-500 p-4">
          <div className="bg-black rounded-2xl p-12">
            <div className="text-white text-center pb-4 font-extrabold text-5xl">
              Let&apos;s grab your YouTube videos.
            </div>
            <div className="text-white text-center pb-8 font-light text-2xl">
              We&apos;re almost done!
            </div>
            <div className="flex flex-col justify-center">
              <RetrievalButton userId={userId} authToken={authToken} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
