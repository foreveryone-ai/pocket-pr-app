import { getChannelId, getVideos } from "@/lib/supabaseClient";
import VideoCard from "@/app/components/VideoCards";
import { auth, currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import Tabs from "@/app/components/Tabs";
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
    <div className="flex min-h-screen flex-col items-center text-black justify-start xl:px-20 pt-10 pb-10 bg-white">
      <Tabs />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-12 gap-12 sm:px-4 md:px-8 lg:px-10 xl:px-20 2xl:px-32">
        {videos
          ? videos.data?.map((video, i) => (
              <VideoCard
                key={i}
                videoId={video.id as string}
                title={video.title as string}
                imageUrl={video.thumbnail_url as string}
                //TODO: store this in database
                width={270}
                height={480}
              />
            ))
          : "no videos found"}
      </div>
      {/*       
      <div className="toast">
        <div className="alert alert-info">
          <span> Hello, {user?.firstName}. Welcome back!</span>
        </div>
      </div> */}
    </div>
  );
}
