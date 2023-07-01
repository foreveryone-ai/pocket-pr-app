import { StoreOrUpdateParams } from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getOAuthData, google } from "@/lib/googleApi";
import {
  storeChannelId,
  getChannelId,
  getVideos,
  storeOrUpdateVideo,
} from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, recentVideos, commentsOneVideo, youtube_channel_id;

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
  //if the client was successfully created, get at most 5 channels from the
  //user account
  if (yt) {
    chList = await yt.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
      maxResults: 5,
    });
    //even unlisted ones at the moment!!
    recentVideos = await yt.search.list({
      order: "date",
      forMine: true,
      part: ["snippet"],
      type: ["video"],
      maxResults: 50,
    });
  }

  const idList = chList?.data.items?.map((item) => item.id) || new Array(0);
  youtube_channel_id = idList.length > 0 ? idList[0] : "";

  await storeChannelId(token as string, userId as string, youtube_channel_id);

  const videosToStore: StoreOrUpdateParams[] = [];

  const videos = recentVideos?.data.items?.map((item) => item);
  videos?.forEach((video) => {
    const vidObj: StoreOrUpdateParams = {
      id: video.id?.videoId as string,
      video_id: video.id?.videoId as string,
      title: video.snippet?.title as string,
      updatedAt: new Date(),
      description: video.snippet?.description as string,
      published_at: video.snippet?.publishedAt as string,
      thumbnail_url: (video.snippet?.thumbnails?.maxres?.url as string) || "",
      channel_title: video.snippet?.title as string,
      channel_id: video.snippet?.channelId as string,
      user_id: userId as string,
    };

    videosToStore.push(vidObj);
  });

  if (token && videosToStore) {
    await storeOrUpdateVideo(token, videosToStore);
  }
  return NextResponse.json({ userId });
}
