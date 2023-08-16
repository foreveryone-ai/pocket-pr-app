import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-base">
        <div className="hero min-h-screen">
          <div className="hero-content  text-center">
            <div className="max-w-5xl bg-base">
              <h2 className="text-secondary pb-10">
                <u>
                  We are currently onboarding YouTube creators into our beta
                  release.
                </u>
              </h2>
              <h1 className="mb-10 text-5xl pb-10 text-white font-black">
                Let&apos;s turn your <i>feedback</i> into <u>fame.</u>
              </h1>
              <SignedIn>
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              </SignedIn>

              <SignedOut>
                <div>
                  <SignUpButton>
                    <div className="btn btn-base mr-4">Sign Up</div>
                  </SignUpButton>
                  <SignInButton>
                    <div className="btn btn-ghost ml-4">Sign In</div>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
