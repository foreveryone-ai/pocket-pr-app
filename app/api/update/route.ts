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
import { GoogleApis } from "googleapis";

export async function GET(request: Request) {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  // create placeholders and update after recieving google token
  let userOAuth,
    yt,
    chList,
    userVideos: any[] = [],
    commentsOneVideo,
    youtube_channel_id;

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
    const idList = chList?.data.items?.map((item) => item.id) || new Array(0);
    youtube_channel_id = idList.length > 0 ? idList[0] : "";
    console.log(youtube_channel_id, "youtube channel id");
    const playlistResponse = await yt.channels.list({
      part: ["contentDetails"],
      id: youtube_channel_id,
    });
    // TODO: playlistItemsResponse might not exist
    const playlistID =
      //@ts-expect-error
      playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 3: Retrieve the videos in the "uploads" playlist
    const videos: any[] = [];
    let nextPageToken: string | null | undefined;
    do {
      const playlistItemsResponse = await yt.playlistItems.list({
        part: ["snippet"],
        playlistId: playlistID,
        maxResults: 50,
        pageToken: nextPageToken as string | undefined,
      });
      // TODO: playlistItemsResponse might not exist
      videos.push(
        //@ts-expect-error
        ...playlistItemsResponse.data.items.map((item) => item.snippet)
      );
      nextPageToken = playlistItemsResponse.data.nextPageToken;
    } while (nextPageToken);

    // Print the video titles
    const videosToStore: StoreOrUpdateParams[] = [];

    for (const video of videos) {
      const vidObj: StoreOrUpdateParams = {
        id: video.resourceId.videoId as string,
        video_id: video.resourceId.videoId as string,
        title: video.title as string,
        updatedAt: new Date(),
        description: video.description as string,
        published_at: video.publishedAt as string,
        thumbnail_url: (video.thumbnails.standard.url as string) || "",
        channel_title: video.channelTitle as string,
        channel_id: video.channelId as string,
        user_id: userId as string,
      };
      videosToStore.push(vidObj);
    }
    console.log("videos to store ", videosToStore);
    if (token && videosToStore) {
      try {
        await storeOrUpdateVideo(token, videosToStore);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //await storeChannelId(token as string, userId as string,  youtube_channel_id);

  // const videos = userVideos?.data.items?.map((item) => item);
  // videos?.forEach((video) => {

  // });

  return NextResponse.json({ userId });
}
