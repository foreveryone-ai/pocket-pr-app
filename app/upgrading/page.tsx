"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import NavBar from "@/app/components/NavBar";

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
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="flex justify-center align-center py-32">
          <Button
            isDisabled={isLoading}
            onPress={fetchUpgradeData}
            className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
          >
            {isLoading ? "Loading..." : "Start upgrade analysis"}
          </Button>
        </div>
      </div>
    </>
  );
}
