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
    <div className="hidden lg:flow-root">
      <div className="bg-green-800 rounded-2xl py-4">
        <h1 className="font-playfair text-white font-black text-2xl flex justify-center ">
          Channel Trends
        </h1>
      </div>
      <div className="py-3" />
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
                <div className="relative flex space-x-2">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="bg-white w-80 "
                  >
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
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-0.5">
                      <div>
                        <p className="text-sm text-green-800 font-inter font-black">
                          {event.title}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={event.datetime}>{event.date}</time>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
