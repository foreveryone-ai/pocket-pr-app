import UpdateDatabase from "../components/UpdateDatabase";
import { auth, currentUser } from "@clerk/nextjs";
import { createUser } from "@/lib/supabaseClient";
import OnboardingPage from "../components/OnboardingPage";
import NavBar from "@/app/components/NavBar";

export default async function Onboarding() {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  console.log("first name: ", user?.firstName);
  console.log(userId);
  console.log("token ", token);

  if (token && userId && user?.firstName) {
    console.log("try and create new user...");
    try {
      const dbUser = await createUser(
        token,
        userId,
        user?.id,
        user?.firstName,
        user?.emailAddresses[0].emailAddress,
        user?.profileImageUrl
      );
      console.log("create user status: ", dbUser);
    } catch (error) {
      console.error("error on create user: ", error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-green-800">
        <NavBar />
        <OnboardingPage />
      </div>
    </>
  );
}
