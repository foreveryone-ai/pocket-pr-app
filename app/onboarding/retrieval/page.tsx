"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getChannelOnboarding,
  getVideoOnboarding,
  getCaptionsOnboarding,
} from "@/lib/api";
import { Button } from "@nextui-org/react";

export default function RetrievalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOnboardingData = async () => {
    setIsLoading(true);
    try {
      await getChannelOnboarding();
      await getVideoOnboarding();
      await getCaptionsOnboarding();
      // If all API calls are successful, redirect to "/upgrading"
      router.push("/upgrading");
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
    <div>
      <Button isDisabled={isLoading} onPress={fetchOnboardingData}>
        {isLoading ? "Loading..." : "Start Retrieval"}
      </Button>
    </div>
  );
}
