import UpdateDatabase from "../components/UpdateDatabase";
import { auth, currentUser } from "@clerk/nextjs";
import { getOAuthData, google } from "@/lib/googleApi";
import { createUser } from "@/lib/supabaseClient";

export default async function Onboarding() {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  // create placeholders and update after recieving google token
  let userOAuth,
    yt,
    chList,
    recentVideos,
    commentsOneVideo,
    videos,
    youtube_channel_id;
  //if the call to clerk was successfull, get the oauth token from google
  //create the youtube client with the token recieved from clerk
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
  //if the client was successfully created, get at most 5 channels from the
  //user account
  if (yt) {
    chList = await yt.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
      maxResults: 5,
    });
  }
  // list of channel ids returned
  const idList = chList?.data.items?.map((item) => item.id);

  if (token && userId && user?.firstName) {
    try {
      const dbUser = await createUser(
        token,
        userId,
        user?.id,
        user?.firstName,
        user?.emailAddresses[0].emailAddress,
        user?.profileImageUrl,
        // youtube channel id
        idList && idList.length > 0 ? (idList[0] as string) : ""
      );
      console.log("create user status: ", dbUser);
    } catch (error) {
      console.error("error on create user: ", error);
    }
  }

  return (
    <section>
      <div>
        <UpdateDatabase />
      </div>
    </section>
  );
}
