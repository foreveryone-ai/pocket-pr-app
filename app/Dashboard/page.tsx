import { createUser } from "@/lib/supabaseClient";
import VideoCard from "@/app/components/VideoCards";
import { auth, currentUser } from "@clerk/nextjs";
// get the OAuth token from clerk

import { getOAuthData, google } from "@/lib/googleApi";

export default async function Home() {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });

  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, recentVideos, commentsOneVideo;

  // if the call to clerk was successfull, get the oauth token from google
  // create the youtube client with the token recieved from clerk
  if (userId) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      console.error("no oauth found ", error);
    }
  }
  try {
    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
  } catch (error) {
    throw new Error("no auth token");
  }
  // if the client was successfully created, get at most 5 channels from the
  // user account
  if (yt) {
    chList = await yt.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
      maxResults: 5,
    });
    // even unlisted ones at the moment!!
    recentVideos = await yt.search.list({
      order: "date",
      forMine: true,
      part: ["snippet"],
      type: ["video"],
      maxResults: 50,
    });
  }
  // make a list of all channelIds that were returned
  const idList = chList?.data.items?.map((item) => item.id);
  // view channel data
  console.log("data for channel Id ", idList && idList[0]);

  const videos = recentVideos?.data.items?.map((item) => item);
  console.log(videos?.forEach((video) => console.log(video.id?.videoId)));

  if (token && userId && user?.firstName) {
    try {
      const dbUser = await createUser(
        token,
        userId,
        user?.id,
        user?.firstName,
        user?.emailAddresses[0].emailAddress,
        user?.profileImageUrl,
        idList && idList.length > 0 ? (idList[0] as string) : ""
      );
      console.log("create user status: ", dbUser);
      //console.log("user: ", user);
    } catch (error) {
      //console.error("error on create user: ", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">Hello, {user?.firstName}. Welcome to back!</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {videos
          ? videos.map((video, i) => (
              <VideoCard
                key={i}
                videoId={video.id?.videoId as string}
                title={video.snippet?.title as string}
                imageUrl={video.snippet?.thumbnails?.maxres?.url as string}
                width={video.snippet?.thumbnails?.maxres?.width as number}
                height={video.snippet?.thumbnails?.maxres?.height as number}
              />
            ))
          : "no videos found"}
      </div>
    </main>
  );
}
