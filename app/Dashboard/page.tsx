"use client";

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {user.firstName}. Welcome to <b>PocketPR</b>.
      </div>
    </main>
  );
}
