import Link from "next/link";
import { Image } from "@nextui-org/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-row items-center justify-center bg-white">
        <Image
          isBlurred
          src="/pocket-pr-logo-licensed.svg"
          alt="panda logo"
          width={700}
          height={300}
        />
      </div>
      {/* <div className="flex min-h-screen flex-row items-center bg-primary-400">
        
        <div className="hero min-h-screen flex-col">
          <div className="hero-content  text-start">
            <div className="max-w-5xl bg-base">
              
            <Image
          isBlurred
          src="/pocket-pr-logo-licensed.svg"
          alt="panda logo"
          width={400}
          height={70}
          className=" m-16"
        />

              <div>
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
      </div> */}
    </main>
  );
}
