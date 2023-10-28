"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

export default function upgrading() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fetchUpgradeData = async () => {
    setIsLoading(true);
    try {
      // api calls go here
    } catch (error) {
      console.error(
        "An error occured while fetching the user's upgrade data",
        error
      );
      // if any API call fails, redirect to "/Dashboard"
      router.push("/Dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button isDisabled={isLoading} onPress={fetchUpgradeData}>
        {isLoading ? "Loading..." : "Start Upgrade"}
      </Button>
    </>
  );
}
