import NavBar from "@/app/components/NavBar";
import SettingsTabs from "@/app/components/SettingsTabs";
import { auth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import {
  getUserSubscriptionStatus,
  storeUserToken,
  getStripeCustomerId,
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

  let customerId = null;
  if (subscriptionStatus) {
    // Get the user's customer id if they have an active subscription
    if (token && userId) {
      customerId = await getStripeCustomerId(token, userId);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <NavBar />
        {subscriptionStatus ? (
          <ProSettingsTabs customerId={customerId} />
        ) : (
          <SettingsTabs />
        )}
      </div>
    </>
  );
}
