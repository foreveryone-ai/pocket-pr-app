import { auth, currentUser } from "@clerk/nextjs";
// TODO: refactor, move this to lib
// get the OAuth token from clerk

import { getOAuthData, google } from "@/lib/googleApi";


export default async function Home() {
  // can probably remove user, but keep userId
  const { userId } = auth();
  const user = await currentUser();
  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, recentVideos, commentsOneVideo;

  // if the call to clerk was successfull, get the oauth token from google
  // create the youtube client with the token recieved from clerk
  if (userId) {
    userOAuth = await getOAuthData(userId, "oauth_google");

    console.log(userOAuth[0].token);

    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
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

    try {
      const myVideoId = "foKcZsIfxYs";
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${myVideoId}&key=${process.env.GOOGLE_API}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const commentsOneVideo = await res.json();
      if (commentsOneVideo) {
        // TODO: FIX THIS
        commentsOneVideo.items.map((item: any) =>
          console.log(item.replies.comments)
        );
      }
    } catch (error) {
      console.error(error);
    }

    // try {
    //   commentsOneVideo = await yt.commentThreads.list({
    //     part: ["id", "snippet", "replies"],
    //     videoId: "foKcZsIfxYs"
    //   });
    // } catch (error) {
    //   console.error(error);
    //   throw Error ("Error getting comments");
    // };
  }

  // console.log(commentsOneVideo);
  // make a list of all channelIds that were returned
  console.log(
    "all channel Ids: ",
    chList?.data.items?.map((item) => item.id)
  );
  console.log(
    "videos returned from search... ",
    recentVideos?.data.items?.map((item) => item)
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {user?.firstName}. Welcome to <b>PocketPR</b>. Your user ID is{" "}
        {userId}.
      </div>
    </main>
  );
}
