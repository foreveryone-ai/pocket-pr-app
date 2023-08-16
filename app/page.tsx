import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="hero min-h-screen">
          <Image src="/kangaroo.png" alt="panda logo" width={400} height={70} />
          <div className="hero-content  text-center">
            <div className="max-w-5xl bg-base">
              <h2 className="text-black pb-24">
                <u>
                  We are currently onboarding YouTube creators into our beta
                  release.
                </u>
              </h2>
              <h1 className="mb-10 text-5xl pb-10 text-black font-black">
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
                    <Button className="mx-4" variant="flat">
                      Sign Up
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button className="mx-4">Sign In</Button>
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
