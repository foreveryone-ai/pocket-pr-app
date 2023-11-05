import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { google } from "googleapis";
import {
  StoreOrUpdateParams,
  getChannelId,
  storeOrUpdateVideo,
  getLatestVideoDate,
  getVideoIdsWithoutComments,
  getAllCommentsByChannelId,
  updateVideoHasEmbeddings,
  getChannelIdByVideoId,
  getVideoIdsWithoutCaptionSummary,
  getCaptions,
  storeCaptionsSummary,
  storeAllCaptionSummary,
} from "@/lib/supabaseClient";
import {
  CreateEmbeddingsArgs,
  PocketChain,
  ChannelChain,
} from "@/lib/langChain";

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

  const playlistResponse = await yt.channels.list({
    part: ["contentDetails"],
    id: youtubeChannelData[0].youtube_channel_id,
  });

  const playlistID =
    //@ts-expect-error
    playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  // Step 3: Retrieve the videos in the "uploads" playlist
  // Get the date of the latest video in the database
  const latestVideoDate = await getLatestVideoDate(
    token as string,
    userId as string
  );

  // Step 3: Retrieve the videos in the "uploads" playlist
  const videos: any[] = [];
  let nextPageToken: string | null | undefined;
  let shouldContinue = true;
  do {
    const playlistItemsResponse = await yt.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistID,
      maxResults: 50,
      pageToken: nextPageToken as string | undefined,
    });

    //@ts-expect-error
    const newVideos = playlistItemsResponse.data.items.map(
      (item) => item.snippet
    );

    for (let video of newVideos) {
      if (
        video &&
        latestVideoDate &&
        video.publishedAt &&
        new Date(video.publishedAt) <= latestVideoDate
      ) {
        shouldContinue = false;
        break;
      }
      videos.push(video);
    }
    nextPageToken = shouldContinue
      ? playlistItemsResponse.data.nextPageToken
      : null;
  } while (nextPageToken);

  // Filter out the videos that are newer than the latest video in the database
  const newVideos = videos.filter((video) =>
    latestVideoDate ? new Date(video.publishedAt) > latestVideoDate : true
  );

  // Store the new videos in the database
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

  if (token && videosToStore) {
    try {
      await storeOrUpdateVideo(token, videosToStore);
    } catch (error) {
      console.error(error);
    }
  }

  // Get captions for the new videos
  // Get captions for the new videos
  if (userOAuth && token) {
    console.log(`getting all captions for ${videosToStore.length} videos`);
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

    // Placeholder for comments-and-replies logic
    await handleCommentsAndReplies(token, userId as string);

    // Placeholder for embeddings logic
    await handleEmbeddings(token, userId as string);

    // Placeholder for captions logic
    await handleCaptions(token, userId as string);

    const channelId = youtubeChannelData[0].youtube_channel_id;

    // Placeholder for all-captions logic
    await handleAllCaptions(token, userId as string, channelId as string);
  }

  return NextResponse.json({
    message:
      "New videos and their captions, comments and replies have been stored, embeddings, caption summaries, and all caption summary have been created and stored successfully",
  });
}

// Placeholder function for comments-and-replies logic
async function handleCommentsAndReplies(token: string, userId: string) {
  console.log("Executing comments-and-replies logic");

  // Get all videoIds that do not have comments
  const videoIdsWithoutComments = await getVideoIdsWithoutComments(
    token,
    userId
  );

  if (!videoIdsWithoutComments) {
    console.log("No videos without comments found");
    return;
  }

  // Iterate over each videoId and fetch and store comments and replies
  for (const videoId of videoIdsWithoutComments) {
    try {
      await GoogleApi.getCommentsAndReplies(token, videoId);
    } catch (error) {
      console.error(
        `Unable to get Comments and Replies for videoId: ${videoId}`,
        error
      );
    }
  }
}

// Placeholder function for embeddings logic
async function handleEmbeddings(token: string, userId: string) {
  console.log("Executing embeddings logic");

  // get all comments for the user
  const commentData = await getAllCommentsByChannelId(token, userId);

  if (!commentData || commentData.length === 0) {
    console.log("No comments to go on");
    return;
  }

  // create objects for metadata
  const comments: CreateEmbeddingsArgs[] = [];

  for (let comment of commentData) {
    comments.push({
      video_id: comment.video_id,
      id: comment.id,
      author_display_name: comment.author_display_name,
      author_image_url: comment.author_image_url,
      text_display: comment.text_display,
      like_count: comment.like_count,
      channelId: comment.channel_id,
    });
  }

  // Create embeddings for each comment
  for (let comment of comments) {
    const channelId = await getChannelIdByVideoId(token, comment.video_id);
    const pc = new PocketChain("", channelId);
    const embeddingsCreated = await pc.createEmbeddings([comment]);

    if (embeddingsCreated) {
      // update the video table
      await updateVideoHasEmbeddings(token, comment.video_id, true);
    } else {
      console.error("Failed to create embeddings for comment: " + comment.id);
    }
  }
}

// Placeholder function for captions logic
async function handleCaptions(token: string, userId: string) {
  console.log("Executing captions logic");

  // Get all videoIds that do not have caption summary
  const videoIdsWithoutCaptionSummary = await getVideoIdsWithoutCaptionSummary(
    token,
    userId
  );

  if (!videoIdsWithoutCaptionSummary) {
    console.log("No videos without caption summary found");
    return;
  }

  // Iterate over each videoId and fetch and store caption summary
  for (const videoId of videoIdsWithoutCaptionSummary) {
    const { data: videoCaptionData, error: videoCaptionError } =
      await getCaptions(token, videoId);

    if (videoCaptionError) {
      console.error("Unable to retrieve captions");
      continue;
    }

    let pc;
    let channelId;
    if (videoCaptionData && videoCaptionData.length > 0) {
      // create summary of captions
      pc = new PocketChain(videoCaptionData[0].captions);
      channelId = videoCaptionData[0].channel_id; // Extract channel_id
    }

    if (!pc) {
      console.error("No video caption data");
      continue;
    }

    const captions = await pc.summarizeCaptions();
    if (captions) {
      // Pass channel_id to storeCaptionsSummary
      await storeCaptionsSummary(
        token,
        videoCaptionData[0].id,
        captions,
        videoId,
        channelId
      );
    }
  }
}

// Placeholder function for all-captions logic
async function handleAllCaptions(
  token: string,
  userId: string,
  channelId: string
) {
  console.log("Executing all-captions logic");

  if (!channelId) {
    console.error("No channel id included");
    return;
  }

  console.log("Passed channelId: ", channelId);

  // Create an instance of ChannelChain and call the summarizeSummaries method
  const channelChain = new ChannelChain();
  const allCaptionsSummary = await channelChain.summarizeSummaries(channelId);

  if (allCaptionsSummary) {
    // Store allCaptionsSummary
    await storeAllCaptionSummary(token, allCaptionsSummary, channelId);
  } else {
    console.error("Failed to create AllCaptionSummary");
  }
}
