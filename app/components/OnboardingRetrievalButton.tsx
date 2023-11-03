// RetrievalButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import {
  getChannelOnboarding,
  getVideoOnboarding,
  getCaptionsOnboarding,
} from "@/lib/api";
import { getUserSubscriptionStatus } from "@/lib/supabaseClient";

interface RetrievalButtonProps {
  userId: string;
  authToken: string;
}

export default function RetrievalButton({
  userId,
  authToken,
}: RetrievalButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOnboardingData = async () => {
    setIsLoading(true);
    try {
      console.log(authToken);
      await getChannelOnboarding();
      await getVideoOnboarding();
      await getCaptionsOnboarding();

      // Get the user's subscription status
      const subscriptionStatus = await getUserSubscriptionStatus(
        userId
        // authToken
      );
      console.log("subscriptionStatus:", subscriptionStatus);
      // If the user is an active subscriber, redirect to "/upgrading"
      // Otherwise, redirect to "/dashboard"
      const redirectPath = subscriptionStatus ? "/upgrading" : "/Dashboard";
      router.push(redirectPath);
    } catch (error) {
      console.error(
        "An error occurred while fetching the user's YouTube content",
        error
      );
      // If any API call fails, redirect to "/"
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isDisabled={isLoading}
      onPress={fetchOnboardingData}
      className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
    >
      {isLoading ? "Loading..." : "Get YouTube Videos"}
    </Button>
  );
}
