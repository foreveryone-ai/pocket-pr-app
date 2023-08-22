"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Image } from "@nextui-org/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import "animate.css/animate.min.css";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import { Playfair_Display } from "next/font/google";

const playfairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});
const playfairDisplay800 = Playfair_Display({
  weight: ["900"],
  subsets: ["latin"],
});

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate__flipInX");
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const Roles = [
    "Content Creators.",
    "Businesses.",
    "Influencers.",
    "Everyone.AI",
  ];

  const tagRef = useRef<HTMLDivElement | null>(null);
  const scrollToTagSection = () => {
    if (tagRef.current) {
      tagRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      name: "Push to deploy.",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
      icon: CloudArrowUpIcon,
    },
    {
      name: "SSL certificates.",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: LockClosedIcon,
    },
    {
      name: "Database backups.",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
      icon: ServerIcon,
    },
  ];

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
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* --------------------------------------HERO-------------------------------------- */}
      <div className="flex justify-center items-start bg-white">
        <div className="w-3/4 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
          <Image
            isBlurred
            src="/pocket-pr-logo-licensed.svg"
            alt="panda logo"
            width={1000}
            height={500}
          />
        </div>
      </div>
      <div className="flex justify-end items-center bg-white grid grid-cols-2 gap-2">
        <h1
          className={`text-med sm:text-lg md:text-3xl lg:text-4xl font-bold text-right text-black ${playfairDisplay500.className}`}
        >
          Automated Public Relations for
        </h1>

        <h1
          ref={textRef}
          key={Roles[currentIndex]}
          className={`text-med sm:text-lg md:text-3xl lg:text-4xl font-bold text-left text-black animate__animated ${animationClass} ${playfairDisplay800.className}`}
        >
          {Roles[currentIndex]}
        </h1>
      </div>
      <div className="flex justify-center mt-12">
        <Button
          color="success"
          endContent={<BsFillArrowDownCircleFill />}
          onClick={scrollToTagSection}
        >
          Learn More
        </Button>
      </div>

      {/* --------------------------------------TAG-------------------------------------- */}
      <div ref={tagRef} className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Deploy faster
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  A better workflow
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Maiores impedit perferendis suscipit eaque, iste dolor
                  cupiditate blanditiis ratione.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
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
            <Image
              src="/dashboard-screenshot.png"
              alt="Product screenshot"
              width={2000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
