import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getOAuthData } from "@/lib/googleApi";
import { google } from "googleapis";
import {
  StoreOrUpdateParams,
  getChannelId,
  storeOrUpdateVideo,
} from "@/lib/supabaseClient";

export async function GET() {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  let userOAuth, yt;

  if (userId && token) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      return NextResponse.json({ message: "No oath found" });
    }
  }

  // connect to youtube and create client
  try {
    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Problem connecting to You Tube account",
    });
  }

  const { data: youtubeChannelData, error: youtubeError } = await getChannelId(
    token as string,
    userId as string
  );

  if (youtubeChannelData && youtubeChannelData.length <= 0) {
    return NextResponse.json({ message: "unable to get youtube channel" });
  }
  if (youtubeError) {
    return NextResponse.json({ message: "Error on get youtube channel" });
  }

  console.log("return from get channelId: ", youtubeChannelData);
  console.log("return from get channelId at 0: ", youtubeChannelData[0]);
  console.log(youtubeChannelData[0].channel_id);

  const playlistResponse = await yt.channels.list({
    part: ["contentDetails"],
    id: youtubeChannelData[0].youtube_channel_id,
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
  return NextResponse.json({ message: "Videos have been stored successfully" });
}
