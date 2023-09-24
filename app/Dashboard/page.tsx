import { getChannelId, getVideos } from "@/lib/supabaseClient";
import VideoCard from "@/app/components/VideoCards";
import { auth, currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import Tabs from "@/app/components/Tabs";
import NavBar from "@/app/components/NavBar";
import { UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";

const timeline = [
  {
    id: 1,
    content: "You started your PocketPR journey!",
    date: "Sep 20",
    datetime: "2023-09-20",
    icon: UserIcon,
    iconBackground: "bg-orange-500",
  },
  {
    id: 2,
    content: "Content Change Led to Audience Decline, Learn How to Proceed.",
    date: "Sep 22",
    datetime: "2023-09-22",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
  },
  {
    id: 3,
    content: "Completed phone screening with",
    date: "Sep 28",
    datetime: "2023-09-28",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
  },
  {
    id: 4,
    content: "Advanced to interview by",
    date: "Sep 30",
    datetime: "2023-09-30",
    icon: UserIcon,
    iconBackground: "bg-orange-500",
  },
  {
    id: 5,
    content: "Completed interview with",
    date: "Oct 4",
    datetime: "2023-10-04",
    icon: ChatBubbleLeftRightIcon,
    iconBackground: "bg-green-500",
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

// get the OAuth token from clerk
export default async function Home() {
  const { userId, getToken } = auth();
  console.log(userId);
  const token = await getToken({ template: "supabase" });

  // create placeholders and update after recieving google token
  let videos, youtube_channel_id;

  try {
    const user = await getChannelId(token as string, userId as string);
    youtube_channel_id = user?.data && user.data[0].youtube_channel_id;
    //console.log("ch id: ", youtube_channel_id);
  } catch (error) {
    console.error("error on get channel id.. ", error);
  }

  try {
    videos = await getVideos(
      token as string,
      (youtube_channel_id as unknown as string) || ""
    );
    console.log("videos from getVideos: ", videos);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-8">
        <Tabs />
        <div className="flex flex-col-2 items-start text-black justify-center xl:px-20 pt-10 pb-10 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-12 gap-12 sm:px-4 md:px-8 lg:px-10">
            {videos
              ? videos.data?.map((video, i) => (
                  <VideoCard
                    key={i}
                    videoId={video.id as string}
                    title={video.title as string}
                    imageUrl={video.thumbnail_url as string}
                    hasEmbeddings={video.hasEmbeddings}
                    //TODO: store this in database
                  />
                ))
              : "no videos found"}
          </div>
          <div className="flow-root">
            <div className="bg-green-800 rounded-2xl py-4">
              <h1 className="font-playfair text-white font-black text-2xl flex justify-center ">
                Channel Trends
              </h1>
            </div>
            <div className="py-3" />
            <ul role="list" className="-mb-8">
              {[...timeline].reverse().map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
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
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {event.content}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={event.datetime}>{event.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
