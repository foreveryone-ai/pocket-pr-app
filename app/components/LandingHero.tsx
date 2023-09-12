"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/button";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/clerk-react";
import Link from "next/link";
import { Image } from "@nextui-org/image";
import { Playfair_Display } from "next/font/google";
import { Divider } from "@nextui-org/divider";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";

const playfairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});

const playfairDisplay650 = Playfair_Display({
  weight: ["600"],
  subsets: ["latin"],
});

const playfairDisplay800 = Playfair_Display({
  weight: ["900"],
  subsets: ["latin"],
});

const features1 = [
  {
    name: "Audience Listening",
    description:
      "With PocketPR, you won't miss a beat. Stay up-to-date with what people are saying and when.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Conflict Mitigation & Forecasting",
    description:
      "Sometimes, when things get tense, it's best to take a step back.",
    icon: LockClosedIcon,
  },
  {
    name: "Growth Planning",
    description:
      "Maintain awareness of your audience's interests as your platform grows.",
    icon: ServerIcon,
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate__flipInX");
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const scrollToTagSection = () => {
    if (tagRef.current) {
      tagRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass("animate__flipOutX");

      if (textRef.current) {
        // <-- This will check for null now
        textRef.current.addEventListener(
          "animationend",
          () => {
            // Update the content and switch to the next animation
            setCurrentIndex((prevIndex) => (prevIndex + 1) % Roles.length);
            setAnimationClass("animate__flipInX");
          },
          { once: true }
        );
      }
    }, 2500);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const Roles = ["Creators.", "Businesses.", "Influencers.", "Everyone.AI"];
  return (
    <>
      <div className="min-h-screen max-h-screen min-w-screen max-w-screen">
        <div className="flex justify-center items-start bg-white">
          <div className="w-3/4 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mt-24 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
            <Image
              isBlurred
              src="/pocket-pr-logo-licensed.svg"
              alt="panda logo"
              width={1000}
              height={500}
            />
          </div>
        </div>
        <div className="overflow-hidden justify-end items-center mt-24 md:mt-0 bg-white grid grid-cols-2 gap-1 md:gap-2">
          <h1 className="font-playfair text-med sm:text-lg md:text-3xl lg:text-4xl text-right text-black">
            Automated PR for
          </h1>

          <h1
            ref={textRef}
            key={Roles[currentIndex]}
            className={`text-med sm:text-lg md:text-3xl lg:text-4xl font-black text-left font-playfair text-black animate__animated ${animationClass}`}
          >
            <b>{Roles[currentIndex]}</b>
          </h1>
        </div>
        <div className="flex justify-center mt-24 md:mt-12 md:mb-36 space-x-4">
          <Button
            color="success"
            endContent={<BsFillArrowDownCircleFill />}
            onClick={scrollToTagSection}
            className="mr=4"
          >
            Learn More
          </Button>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                endContent={<BsFillArrowRightCircleFill />}
              >
                Dashboard
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignUpButton>
              <Button
                variant="ghost"
                endContent={<BsFillArrowRightCircleFill />}
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
      <Divider className="my-4" />
      <div
        ref={tagRef}
        className="mx-auto max-w-7xl py-24 px-6 md:py-32 lg:px-8"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="font-playfair mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Silence the noise.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                PocketPR brings the power of generative-AI to your digital
                interactions. We help you learn how your audience understands
                your content, and how to better communicate with them.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features1.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
            <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
              <Image src="/dashboard-screenshot.png" alt="Product screenshot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
