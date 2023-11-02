"use client";
import { SignIn } from "@clerk/nextjs";
import NavBar from "@/app/components/NavBar";

export default function Page() {
  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center  bg-black pt-12 lg:pt-44 w-full flex-1 px-20 text-center">
          <SignIn path="/sign-in" routing="path" />
        </div>
      </div>
    </>
  );
}
