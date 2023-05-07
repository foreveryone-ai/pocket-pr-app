"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton />
      <div>Hello, {user.firstName}. Welcome to PocketPR.</div>
    </main>
  );
}
