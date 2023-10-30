import NavBar from "@/app/components/NavBar";
import SettingsTabs from "@/app/components/SettingsTabs";
import { auth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import {
  getUserSubscriptionStatus,
  storeUserToken,
} from "@/lib/supabaseClient";
import ProSettingsTabs from "@/app/components/ProSettingsTabs";

export default async function App() {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  if (token && userId) {
    await storeUserToken(token, userId);
  }

  // Get the user's subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(userId as string);

  return (
    <>
      <div className="min-h-screen bg-white">
        <NavBar />
        {subscriptionStatus ? <ProSettingsTabs /> : <SettingsTabs />}
      </div>
    </>
  );
}
