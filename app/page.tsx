"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Image } from "@nextui-org/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import "animate.css/animate.min.css";

const Roles = ["Content Creators", "Businesses", "Influencers", "Everyone"];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate__flipInX");
  const textRef = useRef<HTMLHeadingElement | null>(null);

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
    <main className="bg-white min-h-screen">
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
      <div className="flex justify-center items-center bg-white grid grid-cols-2 gap-2">
        <h1 className="text-med sm:text-lg md:text-3xl lg:text-4xl font-bold text-right text-black">
          Public Relations for
        </h1>
        <h1
          ref={textRef}
          key={Roles[currentIndex]}
          className={`text-med sm:text-lg md:text-3xl lg:text-4xl font-bold text-left text-black animate__animated ${animationClass}`}
        >
          {Roles[currentIndex]}.
        </h1>
      </div>
      <div className="flex justify-center mt-12">
        <Button color="success">Learn More</Button>
      </div>

      {/* --------------------------------------TAG-------------------------------------- */}
    </main>
  );
}
