import { auth, currentUser } from "@clerk/nextjs";
import { createUser, storeUserToken } from "@/lib/supabaseClient";
import OnboardingPage from "../components/OnboardingPage";
import NavBar from "@/app/components/NavBar";
import { Playfair_Display } from "next/font/google";
import { Button } from "@nextui-org/button";

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
        <div className="flex flex-col pt-24 justify-center items-center">
          <h2 className={`py-4  text-3xl ${playFairDisplay800.className}`}>
            Welcome! It&apos;s time to get you onboarded.
          </h2>
          <h1 className={`pb-12 text-2xl ${playFairDisplay500.className}`}>
            In just a few clicks, we&apos;ll have you automated in no-time.
          </h1>
        </div>
        <div className="px-4 py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="flex flex-col justify-between p-6 bg-white rounded-3xl shadow-2xl">
              <div>
                <h3 className="text-3xl font-bold text-black mb-4">Free</h3>
                <p className="text-lg text-gray-500 mb-6">$0 / month</p>
                <ul className="space-y-4 text-gray-700">
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                </ul>
              </div>
              <Button className="mt-6 rounded-2xl">Get Free</Button>
            </div>
            <div className="flex flex-col justify-between p-6 from-yellow-300 via-yellow-500 to-yellow-700 rounded-3xl shadow-2xl bg-gradient-radial ">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Pro</h3>
                <p className="text-lg text-white mb-6">$29 / month</p>
                <ul className="space-y-4 text-white">
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
              </div>
              <Button className="mt-6 rounded-2xl bg-white text-gray-800">
                Get Pro
              </Button>
            </div>
          </div>
        </div>
        <OnboardingPage />
      </div>
    </>
  );
}
