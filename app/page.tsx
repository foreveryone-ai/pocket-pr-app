"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // const handleDashboard = () => {
  //   router.push("/Dashboard");
  // };
  const handleWaitlist = () => {
    router.push("https://wy0877gswx3.typeform.com/c/uL4EZIXe");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 bg-primary">
      <div className="p-5">
        Join <b>The Waitlist</b>
      </div>

      <button className="btn" onClick={handleWaitlist}>
        Sign-Up
      </button>
    </main>
  );
}
