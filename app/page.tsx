"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleDashboard = () => {
    router.push("/Dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 bg-primary">
      <div className="p-5">Welcome to PocketPR. Sign-In to get started.</div>

      <button className="btn" onClick={handleDashboard}>
        Sign-In
      </button>
    </main>
  );
}
