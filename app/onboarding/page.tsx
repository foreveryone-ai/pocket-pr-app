import UpdateDatabase from "../components/UpdateDatabase";
import { auth, currentUser } from "@clerk/nextjs";
import { createUser, storeUserToken } from "@/lib/supabaseClient";
import OnboardingPage from "../components/OnboardingPage";
import NavBar from "@/app/components/NavBar";
import { Playfair_Display } from "next/font/google";

const playFairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});
const playFairDisplay650 = Playfair_Display({
  weight: ["600"],
  subsets: ["latin"],
});
const playFairDisplay800 = Playfair_Display({
  weight: ["900"],
  subsets: ["latin"],
});

export default async function Onboarding() {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  console.log("first name: ", user?.firstName);
  console.log(userId);
  console.log("token ", token);

  if (token && userId) {
    await storeUserToken(token, userId);
  }

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
        // TODO: add channel id here
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
        <div className="flex flex-col py-48 justify-center items-center">
          <h2 className={`py-4  text-3xl ${playFairDisplay800.className}`}>
            Welcome! It&apos;s time to get you onboarded.
          </h2>
          <h1 className={`pb-12 text-2xl ${playFairDisplay500.className}`}>
            In just a few clicks, we&apos;ll have you automated in no-time.
          </h1>
        </div>
        <OnboardingPage />
      </div>
    </>
  );
}
