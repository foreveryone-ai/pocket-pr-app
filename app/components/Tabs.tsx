"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { BsYoutube, BsLinkedin } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";
import { AiFillInstagram } from "react-icons/ai";
import { Button } from "@nextui-org/button";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Chip, user } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { getChannelId, getOrCreateAllCaptionSummary } from "@/lib/api";

const timeline = [
  {
    id: 1,
    title: "Welcome to PocketPR!",
    date: "Sep 20",
    datetime: "2023-09-20",
    icon: UserIcon,
    iconBackground: "bg-orange-500",
    content:
      "Welcome aboard! As your channel grows, new reports and trends will appear here.",
  },
  {
    id: 2,
    title: "View Report",
    date: "Sep 22",
    datetime: "2023-09-22",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
  },
  {
    id: 3,
    title: "View Report",
    date: "Sep 28",
    datetime: "2023-09-28",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
  },
  {
    id: 4,
    title: "New Video",
    date: "Sep 30",
    datetime: "2023-09-30",
    icon: UserIcon,
    iconBackground: "bg-orange-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
  },
  {
    id: 5,
    title: "View Report",
    date: "Oct 4",
    datetime: "2023-10-04",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
  },
  {
    id: 6,
    title: "View Report",
    date: "Oct 4",
    datetime: "2023-10-04",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

type ChannelChatParams = {
  channelId?: string;
  credits?: number;
  nextCreditsDate?: string;
};

export default function Home({
  channelId,
  credits,
  nextCreditsDate,
}: ChannelChatParams) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isCcLoading, setIsCcLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/update-youtube", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload(); // Refresh the page when the API request completes
    }
  };

  const router = useRouter();

  const handleCcClick = async () => {
    console.log("handleCcClick called"); // Add console log here
    setIsCcLoading(true);
    try {
      if (!channelId) {
        try {
          channelId = await getChannelId();
        } catch (error) {
          console.error("Error getting channel id:", error);
        }
      }
      console.log("handleCcClick channelId:", channelId); // Add console log here

      if (!channelId) {
        throw new Error("Failed to get channel id");
      }

      const message = await getOrCreateAllCaptionSummary(channelId);

      if (
        message !== "success" &&
        message !== "Already have all caption summary"
      ) {
        throw new Error("Channel chat failed");
      }

      // If the request was successful, redirect to the channel chat page
      router.push(`/channel-chat/${channelId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCcLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col-3 items-center justify-center">
        <div className="px-4">
          {credits && credits > 0 ? (
            <Button
              className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
              onClick={handleClick}
            >
              {isLoading ? <Spinner size="sm" /> : "Update"}
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
              onPress={async () => {
                console.log("to checkout...");

                try {
                  const res = await fetch("/api/checkout");

                  const data = await res.json();

                  router.replace(data.sessionUrl);
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              Upgrade
            </Button>
          )}
        </div>
        <div className="px-4">
          <Chip size="sm" className="bg-red-700 text-white">
            {credits} credits remaining. 4 more on {nextCreditsDate}
          </Chip>
        </div>
        {/* <div>
            <Tabs
              disabledKeys={[
                "Facebook",
                "Discord",
                "Instagram",
                "Twitch",
                "LinkedIn",
                "Twitter",
              ]}
              aria-label="Options"
              color="default"
              variant="solid"
            >
              <Tab
                key="Instagram"
                title={
                  <div className="flex items-center space-x-2">
                    <AiFillInstagram />
                    <span className="hidden md:inline">Instagram</span>
                  </div>
                }
              />
              <Tab
                key="YouTube"
                title={
                  <div className="flex items-center space-x-2">
                    <BsYoutube />
                    <span className="hidden md:inline">YouTube</span>
                  </div>
                }
              />
              <Tab
                key="LinkedIn"
                title={
                  <div className="flex items-center space-x-2">
                    <BsLinkedin />
                    <span className="hidden md:inline">LinkedIn</span>
                  </div>
                }
              />
            </Tabs>
          </div> */}
        <div>
          <div className="">
            {/* <Button color="success" onClick={handleCcClick}>
                {isCcLoading ? (
                  <Spinner size="sm" color="warning" />
                ) : (
                  "Channel Chat"
                )}
              </Button> */}
          </div>
          <div className="lg:hidden">
            {/* <Button onPress={onOpen}>Trends</Button> */}
            {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col font-playfair font-black">
                        Channel Trends
                      </ModalHeader>
                      <ModalBody>
                        {/* --------------------Hidden on LARGE screens and above-------------------- */}
            {/* <div className="flow-root lg:hidden">
                          <h1 className="font-playfair pb-2 text-green-800 font-black text-2xl flex justify-center ">
                            Channel Trends
                          </h1>
                          <h2 className="font-inter text-gray-500 font-regular text-lg flex justify-center">
                            Learn more about your channel here.
                          </h2>

                          <div className="py-5" />
                          <div className="border overflow-auto p-2 rounded-xl bordered max-h-72">
                            <ul role="list" className="">
                              {[...timeline]
                                .reverse()
                                .map((event, eventIdx) => (
                                  <li key={event.id}>
                                    <div className="relative pb-8">
                                      {eventIdx !== timeline.length - 1 ? (
                                        <span
                                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                          aria-hidden="true"
                                        />
                                      ) : null}
                                      <div className="relative flex space-x-3">
                                        <Accordion variant="shadow">
                                          <AccordionItem
                                            key={event.id}
                                            aria-label={event.title}
                                            title={event.title}
                                            startContent={
                                              <div>
                                                <span
                                                  className={classNames(
                                                    event.iconBackground,
                                                    "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                                                  )}
                                                >
                                                  <event.icon
                                                    className="h-5 w-5 text-white"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              </div>
                                            }
                                          >
                                            <div className="text-black bg-white py-2">
                                              {event.content}
                                            </div>
                                          </AccordionItem>
                                        </Accordion>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                        <Button color="success" isDisabled onPress={onClose}>
                          Trend Settings
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal> */}
          </div>
        </div>
      </div>
    </>
  );
}
