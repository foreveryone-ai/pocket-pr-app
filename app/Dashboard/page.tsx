// app/Dashboard/page.tsx
import {
  getChannelId,
  getVideos,
  getUserSubscriptionStatus,
} from "@/lib/supabaseClient";
import VideoCard from "@/app/components/VideoCards";
import { auth, currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import Tabs from "@/app/components/Tabs";
import ProTabs from "@/app/components/ProTabs";
import NavBar from "@/app/components/NavBar";
import DesktopTrends from "@/app/components/DesktopTrends";

export default async function Home() {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  // create placeholders and update after recieving google token
  let videos, youtube_channel_id, nextCreditsDate;
  let credits: number = 0;

  try {
    const user = await getChannelId(token as string, userId as string);
    youtube_channel_id = user?.data && user.data[0].youtube_channel_id;
    credits = user?.data && user.data[0].credits;
    nextCreditsDate = new Date(
      user?.data && user.data[0].updateCreditDate
    ).toLocaleDateString();
    //console.log("ch id: ", youtube_channel_id);
  } catch (error) {
    console.error("error on get channel id.. ", error);
  }

  try {
    videos = await getVideos(
      token as string,
      (youtube_channel_id as unknown as string) || ""
    );
  } catch (error) {
    console.error(error);
  }

  // Get the user's subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(userId as string);

  return (
    <div className="bg-black min-h-screen">
      <NavBar />
      <div className="pt-6">
        {subscriptionStatus ? (
          <ProTabs channelId={youtube_channel_id} />
        ) : (
          <Tabs
            channelId={youtube_channel_id}
            credits={credits}
            nextCreditsDate={nextCreditsDate}
          />
        )}
        <div className="flex flex-col-1 items-center lg:flex-col-2 lg:items-start text-black justify-center pt-6 pb-6 bg-black ">
          <div className=" rounded-xl  bg-black mx-4 mb-2 pt-5 lg:pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 px-4 md:px-8 lg:px-10 overflow-y-auto h-screen-65 lg:h-screen-75">
            {videos
              ? videos.data?.map((video, i) => (
                  <VideoCard
                    key={i}
                    videoId={video.id as string}
                    title={video.title as string}
                    imageUrl={video.thumbnail_url as string}
                    hasEmbeddings={video.hasEmbeddings}
                    credits={credits}
                    //TODO: store this in database
                    subscriptionStatus={subscriptionStatus as boolean} // Pass subscriptionStatus as a prop
                  />
                ))
              : "no videos found"}
          </div>
        </div>
      </div>
    </div>
  );
}
