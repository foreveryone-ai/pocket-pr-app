"use client";
import { SignIn } from "@clerk/nextjs";
import NavBar from "@/app/components/NavBar";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-black justify-center w-full flex-1 px-20 text-center">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </>
  );
}
