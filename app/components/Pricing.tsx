"use client";
import Link from "next/navigation";
import { CheckIcon } from "@heroicons/react/20/solid";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function Pricing() {
  const includedFeatures = [
    "Unlimited video chats",
    "Private Discord+ access",
    "Primary access to new features",
    "1-on-1 founder support",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 bg-white rounded-xl py-8">
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Get Full Access Today
        </h2>
        <p className="mt-6 text-lg leading-8 text-black">
          Free users can chat with 1 video per week. If you&apos;re serious
          about YouTube, subscribe to get unlimited access to your agent.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-black">
            Starter
          </h3>
          <p className="mt-6 text-base leading-7 text-black">
            Starter subscribers have access to chat with unlimited videos and
            get first access to new features as they are released.
          </p>
          <div className="pt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-green-800">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-black sm:grid-cols-2 sm:gap-6"
          >
            {includedFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-green-800"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-black">Monthly</p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-black">
                  $20
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-black">
                  USD
                </span>
              </p>
              <div className="pt-8 pb-4">
                <SignUpButton>
                  <Button className="bg-green-800 text-white">Sign up</Button>
                </SignUpButton>
              </div>
              {/* <a
                href="/sign-up"
                className="mt-10 block w-full rounded-md bg-green-800  text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              >
                Sign up
              </a> */}
              <p className="mt-6 text-xs leading-5 text-black">
                PocketPR is currently in Beta. Prices subject to change as our
                feature set expands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
