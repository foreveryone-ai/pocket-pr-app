import { redirect } from "next/navigation";
import {
  StoreOrUpdateParams,
  storeChannelId,
  storeOrUpdateVideo,
  storeAllComments,
  storeAllReplies,
  getComments,
  storeCaptions,
  StoreAllCommentsParams,
  StoreAllRepliesParams,
  StoreCaptionsParams,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { GoogleApis, google } from "googleapis";

export async function GET() {
  const { userId, getToken } = auth();
  // const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, youtube_channel_id;

  // if the call to clerk was successfull, get the oauth token from google
  // create the youtube client with the token recieved from clerk
  if (userId && token) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
      console.log("userOAuth on update", userOAuth);
      console.log("userOAuth at 0 on update", userOAuth[0]);
      console.log("userOAuth at 0 token on update", userOAuth[0].token);
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
    // if the channel id was found, store it in the database
    if (youtube_channel_id) {
      try {
        await storeChannelId(
          token as string,
          userId as string,
          youtube_channel_id
        );
      } catch (error) {
        console.error("Error storing the channel ID: ", error);
      }
    }
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

  // if (userId) {
  //   try {
  //     userOAuth = await getOAuthData(userId, "oauth_google");
  //   } catch (error) {
  //     console.error("no oauth found ", error);
  //   }
  // }
  // console.log(userOAuth);
  redirect("/dashboard");

  //return NextResponse.json({ userId });

  // this will hold all comments and replies in memory...
}

// fetch comments from database
//   const commentsForSentament = [];
//   const { data, error } = await getComments(
//     token as string,
//     params.videoid as string
//   );
//   if (data) {
//     for (let comment of data) {
//       commentsForSentament.push(comment.text_display);
//     }
//   } else {
//     console.error(error);
//   }
// }

//    let captionsArr: StoreCaptionsParams[] = [];

// fetch captions from YouTube API
//   try {
//     const res = await fetch(
//       `https://youtube.googleapis.com/youtube/v3/captions?part=snippet&videoId=${params.videoid}&key=${process.env.GOOGLE_API}`,
//       {
//         headers: {
//           Accept: "application/json",
//         },
//       }
//     );
//     const captions = await res.json();
//     if (captions.items) {
//       console.log("got captions id...");
//       for (let caption of captions.items) {
//         console.log(caption.id);
//         const captionRes = await fetch(
//           `https://youtube.googleapis.com/youtube/v3/captions/${caption.id}?key=${process.env.GOOGLE_API}`,
//           {
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${userOAuth[0].token}`,
//             },
//           }
//         );
//         let captionText = await captionRes.text();

//         // Remove timestamps from captionText
//         captionText = removeTimestamps(captionText);

//         console.error(captionRes.status, captionRes.statusText);
//         captionsArr.push({
//           id: caption.id as string,
//           video_id: params.videoid as string,
//           language: caption.snippet.language as string,
//           captions: captionText as string,
//           updatedAt: new Date(),
//         });
//       }
//       await storeCaptions(token as string, captionsArr);
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     console.log("done");
//   }

//   if (!params.videoid) {
//     throw new Error("Video ID is not provided");
//   }

//   return NextResponse.json({ userId });
// } catch (Error) {
//   console.log(Error);
// }
//}
