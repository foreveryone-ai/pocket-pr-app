import { auth, currentUser } from "@clerk/nextjs";
import { createUser } from "@/lib/supabaseClient";
import NavBar from "@/app/components/NavBar";
import { Playfair_Display } from "next/font/google";
import { Button } from "@nextui-org/button";
import OnboardingPlanOptions from "@/app/components/OnboardingPlanOptions";

const playFairDisplay500 = Playfair_Display({
  weight: ["400"],
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

  if (token && userId && user?.firstName) {
    console.log("try and create new user...");
    try {
      const dbUser = await createUser(
        token,
        userId,
        user?.id,
        user?.firstName,
        user?.emailAddresses[0].emailAddress,
        user?.imageUrl
      );
      console.log("create user status: ", dbUser);
    } catch (error) {
      console.error("error on create user: ", error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="px-4 flex flex-col pt-12 justify-center items-center">
          <h2 className="py-4 text-5xl font-extrabold">
            Welcome! It&apos;s time to get you onboarded.
          </h2>
          <h1 className="pb-12 text-2xl font-light">
            In just a few clicks, we&apos;ll have you automated in no-time.
          </h1>
        </div>
        <div className="px-4 pt-6 pb-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <OnboardingPlanOptions />
        </div>
      </div>
    </>
  );
}
