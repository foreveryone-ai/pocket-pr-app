"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

export default function Upgrading() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fetchUpgradeData = async () => {
    setIsLoading(true);
    try {
      // Call /upgrading/comments-and-replies route
      await fetch("/api/upgrading/comments-and-replies", { method: "POST" });

      // Call /upgrading/captions route
      await fetch("/api/upgrading/captions", { method: "POST" });

      // Call /upgrading/embeddings route
      await fetch("/api/upgrading/embeddings", { method: "POST" });

      // Call /upgrading/all-captions route
      await fetch("/api/upgrading/all-captions", { method: "POST" });
    } catch (error) {
      console.error(
        "An error occurred while fetching the user's upgrade data",
        error
      );
      // if any API call fails, redirect to "/Dashboard"
      router.push("/");
    } finally {
      setIsLoading(false);
      router.push("/Dashboard");
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
