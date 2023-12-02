"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useRef } from "react";
import Modal from "@/app/components/landing/Modal";

export default function Hero() {
  const learnMoreRef = useRef<HTMLHeadingElement | null>(null);
  const scrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <section className="bg-black pt-24 lg:pt-36 lg:pb-12 smooth-scroll px-4 lg:px-16">
        <div className="grid max-w-screen-xl px-8 xl:pl-36 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-11">
          <div className="place-self-center lg:col-span-7">
            <h1 className="max-w-3xl mb-4 font-extrabold tracking-tight leading-none text-5xl lg:text-6xl text-white">
              Silence the noise; <br />
              Turn <a className="gradient-text-feedback">feedback</a> into{" "}
              <a className="gradient-text-fame">fame</a>.
            </h1>
            <p className="max-w-2xl mb-6 font-light lg:mb-8 text-2xl lg:text-3xl text-gray-300">
              Automated PR assistants for content creators, influencers, and
              businesses.
            </p>
            <div className="space-x-4">
              {/* <Button
                as={Link}
                variant="flat"
                className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
                href="/sign-up"
              >
                Join Beta
              </Button> */}
              <Modal>Sign Up</Modal>

              <Button
                onPress={scrollToLearnMore}
                variant="ghost"
                className="text-white text-lg"
              >
                Learn More
              </Button>
            </div>
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
      <div className="flex justify-center align-center py-24">
        <h1
          id="learn-more"
          ref={learnMoreRef}
          className="text-gray-400 text-2xl font-bold"
        >
          {/* But, what <i>exactly</i> is automated PR? */}
        </h1>
      </div>
    </>
  );
}
