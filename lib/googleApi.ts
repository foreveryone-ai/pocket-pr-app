import {
  storeAllComments,
  StoreAllCommentsParams,
  storeAllReplies,
  StoreAllRepliesParams,
  storeCaptions,
  StoreCaptionsParams,
} from "./supabaseClient";
import StringHelpers from "@/helpers/stringHelpers";

export async function getOAuthData(userId: string, provider: string) {
  try {
    const res = await fetch(
      `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/${provider}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("error on fetching oauth token from clerk ", error);
  }
}

export class GoogleApi {
  static async getCaptions(
    token: string,
    videoId: string,
    userOAuth: string,
    channel_id: string
  ) {
    console.log("getting captions from google...");
    console.log(
      `token is ${token}, videoId: ${videoId}, userOAuth: ${userOAuth}, Channel ID: ${channel_id}`
    );
    // fetch captions from YouTube API
    let captionsArr: StoreCaptionsParams[] = [];
    try {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${process.env.GOOGLE_API}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const captions = await res.json();
      if (captions.items) {
        console.log("got captions id...");
        for (let caption of captions.items) {
          console.log("captionId: ", caption.id);
          const captionRes = await fetch(
            `https://youtube.googleapis.com/youtube/v3/captions/${caption.id}?key=${process.env.GOOGLE_API}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${userOAuth}`,
              },
            }
          );
          let captionText = await captionRes.text();

          // Remove timestamps from captionText
          const stringHelpers = new StringHelpers();
          captionText = stringHelpers.removeTimestamps(captionText);

          console.error(captionRes.status, captionRes.statusText);
          captionsArr.push({
            id: caption.id as string,
            video_id: videoId as string,
            language: caption.snippet.language as string,
            captions: captionText as string,
            updatedAt: new Date(),
            channel_id: channel_id,
          });
        }
        await storeCaptions(token as string, captionsArr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
    }
  }

  static async getCommentsAndReplies(token: string, videoId: string) {
    // avoid infinite loop for you tube api calls
    let times = 0;
    let failSafe = 10;
    let nextPage: string | undefined;
    let res;
    let morePages = true;
    // keep fetching more comments and replies while there is a nextPage token found in the response
    while (failSafe > 0 && nextPage !== "" && morePages) {
      let commentsOneVideo;
      times++;
      failSafe--;
      console.log("failSafe: ", failSafe);
      console.log("Before request: ", morePages, nextPage, failSafe); // Added this line

      // this should always fire to start
      if (nextPage === "" || nextPage === undefined) {
        console.log("no next page");
        res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${process.env.GOOGLE_API}&maxResults=100`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("got response...");
        commentsOneVideo = await res.json();
        console.log("nextPage token: ", commentsOneVideo.nextPageToken);
        // make this the last loop if there is not nextPageToken
        if (!commentsOneVideo.nextPageToken) {
          console.log("ending loop...");
          morePages = false;
          nextPage = "";
        } else {
          // otherwise set the new token for the next page
          nextPage = commentsOneVideo.nextPageToken;
        }
        console.log("morePages is: ", morePages);
        // store everything in the array at the top and in the database
      } else if (nextPage !== "" && typeof nextPage !== "undefined") {
        console.log("NextPage:", nextPage);
        console.log("getting next page...");
        res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${process.env.GOOGLE_API}&maxResults=100&pageToken=${nextPage}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("got response...");
        commentsOneVideo = await res.json();
        console.log("nextPage token: ", commentsOneVideo.nextPageToken);
        // make this the last loop if there is not nextPageToken
        if (!commentsOneVideo.nextPageToken) {
          morePages = false;
          nextPage = "";
        } else {
          // otherwise set the new token for the next page
          nextPage = commentsOneVideo.nextPageToken;
        }
        console.log("morePages is: ", morePages);
      }

      // store everything in the array at the top and in the database
      if (commentsOneVideo) {
        const commentsArr: StoreAllCommentsParams[] = [];
        const repliesArr: StoreAllRepliesParams[] = [];
        console.log(commentsOneVideo.items.length);
        for (let item of commentsOneVideo.items) {
          commentsArr.push({
            id: item.snippet.topLevelComment.id as string,
            comment_id: item.snippet.topLevelComment.id as string,
            text_display: item.snippet.topLevelComment.snippet
              .textDisplay as string,
            like_count: item.snippet.topLevelComment.snippet
              .likeCount as number,
            published_at: item.snippet.topLevelComment.snippet
              .publishedAt as Date,
            video_id: item.snippet.topLevelComment.snippet.videoId as string,
            author_display_name: item.snippet.topLevelComment.snippet
              .authorDisplayName as string,
            author_image_url: item.snippet.topLevelComment.snippet
              .authorProfileImageUrl as string,
            updatedAt: new Date(),
            channel_id: item.snippet.topLevelComment.snippet
              .authorChannelId as string,
          });
          if (item.replies) {
            for (let reply of item.replies.comments) {
              repliesArr.push({
                id: reply.id as string,
                reply_id: reply.id as string,
                text_display: reply.snippet.textDisplay as string,
                like_count: reply.snippet.likeCount as number,
                published_at: reply.snippet.publishedAt as Date,
                comment_id: item.snippet.topLevelComment.id as string,
                author_display_name: reply.snippet.authorDisplayName as string,
                author_image_url: reply.snippet.authorProfileImageUrl as string,
                updatedAt: new Date(),
                channel_id: item.snippet.topLevelComment.snippet
                  .authorChannelId as string,
              });
            }
          }
        }
        console.log("storing to database", times);
        console.log(commentsArr.length);
        console.log(repliesArr.length);
        await storeAllComments(token as string, commentsArr);
        await storeAllReplies(token as string, repliesArr);
      }
    }
  }
}
