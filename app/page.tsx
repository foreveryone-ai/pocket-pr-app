"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleDashboard = () => {
    router.push("/Dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Welcome to PocketPR. Sign-In to get started.</div>
      <button className="btn" onClick={handleDashboard}>
        Sign-In
      </button>
    </main>
  );
}
