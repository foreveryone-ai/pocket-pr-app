"use client";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useRef } from "react";

export default function About() {
  return (
    <>
      {/* -----------STEP 1------------ */}
      <div className="flex flex-col justify-center align-center max-w-2xl mx-auto bg-black">
        <div className="min-h-screen">
          <div className="pt-40">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-2">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-center align-center md:text-5xl xl:text-6xl font-extrabold gradient-text-dual">
                  Close the gap.
                </h1>
                <p className="px-8 pb-4 text-center font-light text-2xl lg:text-3xl text-gray-300">
                  Navigating through the noise of digital communications can be
                  overwhelming. That's where we come in. PocketPR manages the
                  flood, ensuring no valuable feedback is lost, and transforming
                  it into clear, actionable insights that pave your way to fame.
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen">
          <div className="pt-40">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-2">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-center align-center md:text-5xl xl:text-6xl font-extrabold gradient-text-dual">
                  Beyond listening.
                </h1>
                <p className="px-8 pb-4 text-center font-light text-2xl lg:text-3xl text-gray-300">
                  Traditional tools provide generic sentiment analysis, but we
                  delve deeper. By understanding the context of your content,
                  and aligning it with the current news, events, and pop
                  culture, we provide comprehensive advice that helps optimize
                  your platform, resolve conflicts, and guide your growth.
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen">
          <div className="pt-40">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-2">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-center align-center md:text-5xl xl:text-6xl font-extrabold gradient-text-dual">
                  Cross-platform.
                </h1>
                <p className="px-8 pb-4 text-center font-light text-2xl lg:text-3xl text-gray-300">
                  While our beta release offers support for YouTube creators,
                  our developer roadmap shows a projected timeline for the added
                  support of Instagram, X (fka "Twitter"), LinkedIn, Facebook,
                  Twitch, and more.
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
