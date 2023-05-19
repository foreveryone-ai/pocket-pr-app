import VideoCard from "@/app/components/VideoCards";
import { auth, currentUser } from "@clerk/nextjs";
// TODO: refactor, move this to lib
// get the OAuth token from clerk
import { getOAuthData, google, getCommentsFromVideo } from "@/lib/googleApi";
export default async function Home() {
  // can probably remove user, but keep userId
  const { userId } = auth();
  const user = await currentUser();
  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, recentVideos, commentsOneVideo;

  // if the call to clerk was successfull, get the oauth token from google
  // create the youtube client with the token recieved from clerk
  if (userId) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      throw new Error("no oauth found");
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
      maxResults: 5,
    });
  }
  // make a list of all channelIds that were returned
  const idList = chList?.data.items?.map((item) => item.id);
  // view channel data
  //console.log("data for channel Id ", idList && idList[0]);

  const videos = recentVideos?.data.items?.map((item) => item);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {user?.firstName}. Welcome to <b>PocketPR</b>. Your user ID is{" "}
        {userId}.
      </div>
      <div>
        {videos
          ? videos.map((video, i) => (
              <VideoCard
                key={i}
                title={video.snippet?.title as string}
                description={video.snippet?.description as string}
                imageUrl="/flowers.jpg"
              />
            ))
          : "no videos found"}
      </div>
    </main>
  );
}
