import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";
export default function Hero() {
  return (
    <>
      <section className="bg-black lg:pt-32 lg:pb-12">
        <div className="grid max-w-screen-xl px-8 xl:pl-36 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-11">
          <div className="place-self-center lg:col-span-7">
            <h1 className="max-w-3xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">
              Silence the noise; <br />
              Turn <a className="gradient-text-feedback">feedback</a> into{" "}
              <a className="gradient-text-fame">fame</a>.
            </h1>
            <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-gray-300">
              A happy audience is a happy life. We're building automated public
              relations agents for content creators, influencers, and businesses
              alike.
            </p>
            <Button as={Link} variant="shadow" href="/sign-up">
              Join Beta
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>
          <div className="hidden lg:col-span-3 lg:flex xl:pl-12 xl:pr-2">
            <Image
              src="/gunmetal-panda-asset.svg"
              alt="panga"
              height="350"
              width="350"
            />
          </div>
        </div>
      </section>
    </>
  );
}
