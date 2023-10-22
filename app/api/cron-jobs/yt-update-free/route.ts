import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { google } from "googleapis";
import {
  StoreOrUpdateParams,
  getChannelId,
  storeOrUpdateVideo,
  getLatestVideoDate,
  getUserSubscriptionStatus,
} from "@/lib/supabaseClient";

export async function GET() {
  // get user authentication details
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  // redirect user to sign-in if token or userId is not found
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // check user subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(
    token as string,
    userId as string
  );
  if (subscriptionStatus === true) {
    return NextResponse.json({
      message:
        "User has an active subscription, detonating yt-update-free/route",
    });
  }

  let userOAuth, yt;

  // get oauth ddata if userId and token are available
  if (userId && token) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      return NextResponse.json({ message: "No oath found" });
    }
  }

  // connect to YT and create client
  try {
    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Problem connecting to YouTube account",
    });
  }

  // get YT channel data
  const { data: youtubeChannelData, error: youtubeError } = await getChannelId(
    token as string,
    userId as string
  );

  // handle errors in getting YT channel data
  if (youtubeChannelData && youtubeChannelData.length <= 0) {
    return NextResponse.json({ message: "Unable to get YouTube channel" });
  }
  if (youtubeError) {
    return NextResponse.json({ message: "Error on get YouTube channel" });
  }

  // get playlist response
  const playlistResponse = await yt.channels.list({
    part: ["contentDetails"],
    id: youtubeChannelData[0].youtube_channel_id,
  });

  // get playlist id
  const playlistID =
    //@ts-expect-error
    playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  // initialize videos array and nextPageToken
  const videos: any[] = [];
  let nextPageToken: string | null | undefined;

  // retrieve the videos in the "uploads" playlist
  do {
    const playlistItemsResponse = await yt.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistID,
      maxResults: 50,
      pageToken: nextPageToken as string | undefined,
    });

    // push videos to the videos array
    videos.push(
      //@ts-expect-error
      ...playlistItemsResponse.data.items.map((item) => item.snippet)
    );
    nextPageToken = playlistItemsResponse.data.nextPageToken;
  } while (nextPageToken);

  // get the date of the latest video in the database
  const latestVideoDate = await getLatestVideoDate(
    token as string,
    userId as string
  );

  // filter out the videos that are newer than the latest video in the database
  const newVideos = videos.filter((video) =>
    latestVideoDate ? new Date(video.publishedAt) > latestVideoDate : true
  );

  // prepare new videos to be stored in the database
  const videosToStore: StoreOrUpdateParams[] = newVideos.map((video) => ({
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
  }));

  // store new videos in the database
  if (token && videosToStore) {
    try {
      await storeOrUpdateVideo(token, videosToStore);
    } catch (error) {
      console.error(error);
    }
  }

  // get captions for the new videos
  if (userOAuth && token) {
    console.log(`Getting all captions for ${videosToStore.length} videos`);
    for (let video of videosToStore) {
      try {
        await GoogleApi.getCaptions(
          token,
          video.id,
          userOAuth[0].token,
          video.channel_id
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  // return success message
  return NextResponse.json({
    message: "New videos and their captions have been stored successfully",
  });
}
