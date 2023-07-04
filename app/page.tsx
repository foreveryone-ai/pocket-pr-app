import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-base">
        <div className="hero min-h-screen">
          <div className="hero-content  text-center">
            <div className="max-w-5xl bg-base">
              <h2 className="text-secondary pb-10">
                <i>
                  We are currently onboarding YouTube creators into our beta
                  release
                </i>
              </h2>
              <h1 className="mb-10 text-5xl pb-10 text-white font-black">
                let's turn your <i>feedback</i> into <u>fame</u>
              </h1>
              <SignedIn>
                <Link href="/dashboard" className="btn btn-ghost">
                  Dashboard
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
