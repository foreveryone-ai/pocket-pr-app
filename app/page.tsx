import Link from "next/link";
import { Image } from "@nextui-org/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-row items-center bg-primary-400">
        <Image
          isBlurred
          src="/kangaroo.png"
          alt="panda logo"
          width={400}
          height={70}
          className=" m-16"
        />
        <div className="hero min-h-screen flex-col">
          <div className="hero-content  text-start">
            <div className="max-w-5xl bg-base">
              <h1 className="text-4xl pb-10 text-white font-black">
                <b>pocketPR</b> is for <i>Content Creators </i>
              </h1>
              <h1 className="mb-10 text-5xl pb-10 text-white font-black">
                Let&apos;s turn your feedback into FAME
              </h1>
              <SignedIn>
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <Link href="#">
                  <Button variant="bordered" className="mx-4">
                    Learn More
                  </Button>
                </Link>
              </SignedIn>

              <div>
                <SignedOut>
                  <SignUpButton>
                    <Button className="mx-4">Sign Up</Button>
                  </SignUpButton>
                  <Link href="#">
                    <Button variant="bordered" className="mx-4">
                      Learn More
                    </Button>
                  </Link>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
