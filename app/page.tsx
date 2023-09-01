"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Image } from "@nextui-org/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spacer } from "@nextui-org/spacer";
import "animate.css/animate.min.css";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { Playfair_Display } from "next/font/google";
import DashboardHero from "./components/DashboardHero";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const playfairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});
const playFairDisplay650 = Playfair_Display({
  weight: ["600"],
  subsets: ["latin"],
});
const playfairDisplay800 = Playfair_Display({
  weight: ["900"],
  subsets: ["latin"],
});

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const features2 = [
    {
      name: "Cross-Platform Context",
      description:
        "Today, we offer support for YouTube. Soon, we'll support a multitude of social networks, allowing your PR assistant to gain an understanding of your audience's perspectives across platforms.",
      icon: CloudArrowUpIcon,
    },
    {
      name: "Chat-With-Your-Posts",
      description:
        "Talk to your assistant about any of your individual posts and what people are saying about them, or zoom out and talk to your entire channel.",
      icon: LockClosedIcon,
    },
    {
      name: "Analytical Reports",
      description:
        "Future updates will bring a multitude of analytical reports, with the goal of bolstering productive dialogues, predicting consumer trends, and maximizing your bottom line as an online creator.",
      icon: ServerIcon,
    },
  ];

  const hobbyFeatures = [
    "Chat with 1 video per week",
    "Sentiment Reports",
    "Conflict Detection Reports",
  ];
  const scaleFeatures = [
    "Chat with unlimited videos",
    "Platform-Growth Consultation",
    "Chat with your channel",
  ];
  const growthFeatures = [
    "Chat with 3 videos per week",
    "Sentiment & Conflict Mitigation Reports",
    "Chat with any YouTube video",
  ];

  const navigation = [
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* --------------------------------------HERO-------------------------------------- */}
        <DashboardHero />
        {/* --------------------------------------TAG-------------------------------------- */}

        <div className="mx-auto max-w-xl py-24 px-6 md:py-32 lg:px-8">
          <div className="relative isolate flex justify-center align-center overflow-hidden bg-green-900 shadow-2xl rounded-3xl pt-10 pb-10 lg:flex lg:gap-x-10 lg:px-10">
            <div className="mx-12 max-w-md text-center  lg:py-32 lg:text-center">
              <h2
                className={`${playFairDisplay650.className} text-3xl font-bold tracking-tight text-white sm:text-4xl`}
              >
                Focus.
              </h2>
              <p className="mt-4 text-lg text-white">(take the high road)</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
                <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                  <Image src="/chat-screenshot.png" alt="Product screenshot" />
                </div>
              </div>

              <div className="lg:ml-auto lg:pl-4 lg:pt-4">
                <div className="lg:max-w-lg">
                  <p
                    className={`${playFairDisplay650.className} mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl`}
                  >
                    Turn feedback into fame.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    This is just the beginning of a central-hub for your
                    platform-growth. We aim to bring a robust understanding of
                    the entirety of your online presence in an effort to best
                    guide your decision making as a creator and
                    online-personality.
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    {features2.map((feature) => (
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
            </div>
          </div>
        </div>

        <div className="bg-green-900 min-h-screen">
          <div className="px-6 pt-12 lg:px-8 lg:pt-20">
            <div className="text-center">
              <p
                className={`${playFairDisplay650.className} mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl`}
              >
                The right price for you, whoever you are
              </p>
              <p className="mx-auto mt-3 max-w-4xl text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                Try one video for free, and if you like what you see, come back
                and find the plan that fits your goals.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-green pb-12 lg:mt-20 lg:pb-20">
            <div className="relative z-0">
              <div className="absolute inset-0 h-5/6 bg-green-900 lg:h-2/3" />
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative lg:grid lg:grid-cols-7">
                  <div className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none">
                    <div className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-l-lg">
                      <div className="flex flex-1 flex-col">
                        <div className="bg-white px-6 py-10">
                          <div>
                            <h3
                              className="text-center text-2xl font-medium text-gray-900"
                              id="tier-hobby"
                            >
                              Hobbyist
                            </h3>
                            <div className="mt-4 flex items-center justify-center">
                              <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900">
                                <span className="mr-2 mt-2 text-4xl font-medium tracking-tight">
                                  $
                                </span>
                                <span className="font-bold">9</span>
                              </span>
                              <span className="text-xl font-medium text-gray-500">
                                /month
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between border-t-2 border-gray-100 bg-gray-50 p-6 sm:p-10 lg:p-6 xl:p-10">
                          <ul role="list" className="space-y-4">
                            {hobbyFeatures.map((feature) => (
                              <li key={feature} className="flex items-start">
                                <div className="flex-shrink-0">
                                  <CheckIcon
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <p className="ml-3 text-base font-medium text-gray-500">
                                  {feature}
                                </p>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8">
                            <div className="rounded-lg shadow-md">
                              <a
                                href="#"
                                className="block w-full rounded-lg border border-transparent bg-white px-6 py-3 text-center text-base font-medium text-green-600 hover:bg-gray-50"
                                aria-describedby="tier-hobby"
                              >
                                Start your trial
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
                    <div className="relative z-10 rounded-lg shadow-xl">
                      <div
                        className="pointer-events-none absolute inset-0 rounded-lg border-2 border-green-600"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 top-0 translate-y-px transform">
                        <div className="flex -translate-y-1/2 transform justify-center">
                          <span className="inline-flex rounded-full bg-green-600 px-4 py-1 text-base font-semibold text-white">
                            Most popular
                          </span>
                        </div>
                      </div>
                      <div className="rounded-t-lg bg-white px-6 pb-10 pt-12">
                        <div>
                          <h3
                            className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:-mx-6"
                            id="tier-growth"
                          >
                            Content Creator
                          </h3>
                          <div className="mt-4 flex items-center justify-center">
                            <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900 sm:text-6xl">
                              <span className="mr-2 mt-2 text-4xl font-medium tracking-tight">
                                $
                              </span>
                              <span className="font-bold">25</span>
                            </span>
                            <span className="text-2xl font-medium text-gray-500">
                              /month
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-b-lg border-t-2 border-gray-100 bg-gray-50 px-6 pb-8 pt-10 sm:px-10 sm:py-10">
                        <ul role="list" className="space-y-4">
                          {growthFeatures.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <div className="flex-shrink-0">
                                <CheckIcon
                                  className="h-6 w-6 flex-shrink-0 text-green-500"
                                  aria-hidden="true"
                                />
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {feature}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-10">
                          <div className="rounded-lg shadow-md">
                            <a
                              href="#"
                              className="block w-full rounded-lg border border-transparent bg-green-600 px-6 py-4 text-center text-xl font-medium leading-6 text-white hover:bg-green-700"
                              aria-describedby="tier-growth"
                            >
                              Start your trial
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto mt-10 max-w-md lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
                    <div className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-r-lg">
                      <div className="flex flex-1 flex-col">
                        <div className="bg-white px-6 py-10">
                          <div>
                            <h3
                              className="text-center text-2xl font-medium text-gray-900"
                              id="tier-scale"
                            >
                              Influencer
                            </h3>
                            <div className="mt-4 flex items-center justify-center">
                              <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900">
                                <span className="mr-2 mt-2 text-4xl font-medium tracking-tight">
                                  $
                                </span>
                                <span className="font-bold">49</span>
                              </span>
                              <span className="text-xl font-medium text-gray-500">
                                /month
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between border-t-2 border-gray-100 bg-gray-50 p-6 sm:p-10 lg:p-6 xl:p-10">
                          <ul role="list" className="space-y-4">
                            {scaleFeatures.map((feature) => (
                              <li key={feature} className="flex items-start">
                                <div className="flex-shrink-0">
                                  <CheckIcon
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <p className="ml-3 text-base font-medium text-gray-500">
                                  {feature}
                                </p>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8">
                            <div className="rounded-lg shadow-md">
                              <a
                                href="#"
                                className="block w-full rounded-lg border border-transparent bg-white px-6 py-3 text-center text-base font-medium text-green-600 hover:bg-gray-50"
                                aria-describedby="tier-scale"
                              >
                                Start your trial
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 sm:px-6 sm:py-32 md:py-12 lg:px-8">
          <div
            className={`${playFairDisplay650.className} pb-12 hidden md:block text-center font-black text-black`}
          >
            Frequently Asked Questions
          </div>
          <div
            className={` pb-12 md:hidden text-center font-black text-xl text-black ${playFairDisplay650.className}`}
          >
            FAQ's
          </div>
          <Accordion variant="splitted">
            <AccordionItem
              className="text-black"
              key="1"
              aria-label="Accordion 1"
              title="What is PocketPR?"
            >
              PocketPR is an app! It's built with code. Does cool stuff! Try it
              out. Give us your money!
            </AccordionItem>
            <AccordionItem
              className="text-black"
              key="2"
              aria-label="Accordion 2"
              title="Does it really read all of my comments?"
            >
              Yeah! I think? We don't really know! But if you pretend it does,
              it's all the same, really!
            </AccordionItem>
            <AccordionItem
              className="text-black"
              key="3"
              aria-label="Accordion 3"
              title="Why does it cost money?"
            >
              Because we're greedy pigs. This took us 2 hours to build.
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mx-auto max-w-7xl sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-green-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2
                className={`${playFairDisplay650.className} text-2xl font-bold tracking-tight text-white sm:text-3xl`}
              >
                Leave the noise 4 GPT.
                <br />
                <Spacer y={2} />
                Sign-up today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                What you see is just the beginning. Users that sign-up today
                will receive priority access to new features and beta releases!
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="/sign-up"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Sign Up
                </a>
                <a
                  href="/sign-in"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Sign In <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Image
                src="/happykang.svg"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>

        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2023 ForEveryone.AI - All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
