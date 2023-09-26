"use client";
import { UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
const timeline = [
  {
    id: 1,
    title: "Welcome to PocketPR!",
    date: "Sep 20",
    datetime: "2023-09-20",
    icon: UserIcon,
    iconBackground: "bg-orange-500",
    content:
      "The content of the trend report produced by ChatGPT will be inserted here.",
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
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function DesktopTrends() {
  return (
    <div className="hidden lg:flow-root lg:w-80">
      <div className="border rounded-lg bordered overflow-y-auto h-screen-75 bg-gray-50">
        <div className=" rounded-lg  bg-gray-50 py-4">
          <h1 className="font-playfair text-black font-black text-2xl flex justify-center ">
            Channel Trends
          </h1>
          <div className="py-1" />
          <h2 className="font-inter text-gray-500 font-regular text-md flex justify-center">
            Learn more about your channel here.
          </h2>
        </div>
        <div className="py-1" />
        <div className="pl-4 pr-4">
          <ul role="list" className="">
            {[...timeline].reverse().map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== timeline.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative space-x-2">
                    <Accordion
                      variant="shadow"
                      className="w-full"
                      motionProps={{
                        variants: {
                          enter: {
                            y: 0,
                            opacity: 1,
                            height: "auto",
                            transition: {
                              height: {
                                type: "spring",
                                stiffness: 300,
                                damping: 40,
                                duration: 1,
                              },
                              opacity: {
                                easings: "ease",
                                duration: 1,
                              },
                            },
                          },
                          exit: {
                            y: -10,
                            opacity: 0,
                            height: 0,
                            transition: {
                              height: {
                                type: "spring",
                                stiffness: 300,
                                damping: 40,
                                duration: 1,
                              },
                              opacity: {
                                easings: "ease",
                                duration: 1,
                              },
                            },
                          },
                        },
                      }}
                    >
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
    </div>
  );
}
