import { NextResponse, NextRequest } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { google } from "googleapis";
import {
  StoreOrUpdateParams,
  getChannelId,
  storeOrUpdateVideo,
  getLatestVideoDate,
  getActiveSubscribers,
  getUserToken,
  getCaptionSummary,
  getCaptions,
  storeCaptionsSummary,
  getAllCaptionSummary,
  storeAllCaptionSummary,
  getMostRecentCaptionSummary,
  getComments,
  updateVideoHasEmbeddings,
} from "@/lib/supabaseClient";
import { PocketChain, ChannelChain } from "@/lib/langChain";
import type { CreateEmbeddingsArgs } from "@/lib/langChain";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false },
      {
        status: 401,
      }
    );
  }
  // get all active subscribers
  const activeSubscribers = await getActiveSubscribers();
  if (!activeSubscribers) {
    return NextResponse.json({ message: "No active subscribers found" });
  }

  for (const userId of activeSubscribers) {
    const token = await getUserToken(userId as string);
    let userOAuth, yt;

    // get oauth data if userId and token are available
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
    const { data: youtubeChannelData, error: youtubeError } =
      await getChannelId(token as string, userId as string);

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

    // get the date of the latest video in the database
    const latestVideoDate = await getLatestVideoDate(
      token as string,
      userId as string
    );

    // retrieve the videos in the "uploads" playlist
    do {
      const playlistItemsResponse = await yt.playlistItems.list({
        part: ["snippet"],
        playlistId: playlistID,
        maxResults: 50,
        pageToken: nextPageToken as string | undefined,
      });

      // push videos to the videos array
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
          nextPageToken = null;
          break;
        }
        videos.push(video);
      }

      nextPageToken = playlistItemsResponse.data.nextPageToken;
    } while (nextPageToken);

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

          // After storing captions, make calls to the other routes
          const videoId = video.id;
          const channelId = video.channel_id;

          // Call /analysis/captions
          let pc;

          //--------------- check if caption summary already exists start ------------------//
          const {
            data: videoCaptionSummaryData,
            error: videoCaptionSummaryError,
          } = await getCaptionSummary(token as string, "", videoId);

          if (videoCaptionSummaryError) {
            throw new Error("error on caption summary");
          }
          if (videoCaptionSummaryData && videoCaptionSummaryData.length > 0) {
            console.log("Already have caption summary");
          } else {
            //--------------- check if caption summary already exists end ------------------//

            const { data: videoCaptionData, error: videoCaptionError } =
              await getCaptions(token as string, videoId);

            if (videoCaptionError) {
              console.log("Unable to retrieve captions");
            }

            if (videoCaptionData && videoCaptionData.length > 0) {
              // create summary of captions
              pc = new PocketChain(videoCaptionData[0].captions);
            }

            if (!pc) {
              throw new Error("no video caption data");
            }

            const captions = await pc.summarizeCaptions();
            if (captions) {
              // Pass channel_id to storeCaptionsSummary
              await storeCaptionsSummary(
                token as string,
                videoCaptionSummaryData[0].id,
                captions,
                videoId,
                channelId
              );
              console.log("success");
            }
          }

          // Call /analysis/all-captions
          let cc;

          //--------------- check if all caption summary already exists start ------------------//
          const allCaptionSummaryData = await getAllCaptionSummary(
            token as string,
            channelId
          );

          // Fetch the most recent CaptionSummary for the given channel_id
          const mostRecentCaptionSummary = await getMostRecentCaptionSummary(
            token as string,
            channelId
          );

          // If an AllCaptionSummary already exists and the most recent CaptionSummary is not more recent, return a message
          if (
            allCaptionSummaryData.data &&
            allCaptionSummaryData.data.length > 0 &&
            mostRecentCaptionSummary && // Check if mostRecentCaptionSummary is not null
            mostRecentCaptionSummary.createdAt <=
              allCaptionSummaryData.data[0].created_at
          ) {
            console.log("Already have all caption summary");
          } else {
            // Create an instance of ChannelChain and call the summarizeSummaries method
            const channelChain = new ChannelChain();
            const allCaptionsSummary = await channelChain.summarizeSummaries(
              channelId
            );

            if (allCaptionsSummary) {
              // Store allCaptionsSummary
              await storeAllCaptionSummary(
                token as string,
                allCaptionsSummary,
                channelId
              );
              console.log("success");
            }
          }

          // Call /analysis/comments-and-replies
          //--------- check if comments already exist start-------------//
          const { data: commentData, error: commentError } = await getComments(
            token as string,
            videoId
          );

          if (commentError) {
            console.log("Unable to get comments");
          }
          if (commentData && commentData.length > 0) {
            console.log("Already have comments");
          } else {
            //--------- check if comments already exist end-------------//

            try {
              await GoogleApi.getCommentsAndReplies(token as string, videoId);
              console.log("success");
            } catch (error) {
              console.error("Unable to get Comments and Replies");
            }
          }

          // Call /analysis/embeddings
          // check if embeddings exist
          console.log("Retrieved channelId: ", channelId);
          const poc = new PocketChain(
            videoCaptionSummaryData[0].summaryText,
            channelId
          );
          const hasEmbeddings = await poc.hasEmbeddings(videoId);
          console.log("We have embeddings? ", hasEmbeddings);

          if (hasEmbeddings) {
            // update bool on Video
            const { data: embedData, error: embedError } =
              await updateVideoHasEmbeddings(token as string, videoId, true);
            if (embedError) {
              throw new Error("error on check embeddings");
            }
            if (embedData && embedData.length > 0) {
              console.log("already have embeddings");
            }
          } else {
            // create objects for metadata
            const comments: CreateEmbeddingsArgs[] = [];

            if (commentData) {
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
            } else {
              console.log("No comment data available");
            }

            const embeddingsCreated = await poc.createEmbeddings(comments);
            if (embeddingsCreated) {
              // update the video table
              const { data: embedData, error: embedError } =
                await updateVideoHasEmbeddings(token as string, videoId, true);
              if (embedError) {
                throw new Error("error on check embeddings");
              }
              if (embedData && embedData.length > 0) {
                console.log("already have embeddings");
              }
            } else {
              console.log("fail");
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  // Return success message
  return NextResponse.json({
    message:
      "New videos and their captions have been stored successfully for all active subscribers",
  });
}
