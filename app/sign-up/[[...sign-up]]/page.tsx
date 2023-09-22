"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-green-800 justify-center w-full flex-1 px-20 text-center">
        <SignUp path="/sign-up" routing="path" />
      </div>
    </>
  );
}
