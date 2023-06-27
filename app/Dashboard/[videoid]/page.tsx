import { getSentiment, getVideoSummary } from "@/lib/openai";
import {
  storeAllComments,
  storeAllReplies,
  storeCaptions,
  type StoreAllCommentsParams,
  type StoreAllRepliesParams,
  getComments,
  type StoreCaptionsParams,
  type CommentsResponseSuccess,
  type CommentsResponseError,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";

import { getOAuthData } from "@/lib/googleApi";

export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });
  const user = await currentUser();

  let userOAuth;

  if (userId) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      console.error("no oauth found ", error);
    }
  }
  console.log(userOAuth);

  // this will hold all comments and replies in memory...
  const commentsAndReplies = [];
  try {
    // avoid infinite loop for you tube api calls
    let failSafe = 2;
    let nextPage: string | undefined;
    let res;
    let morePages = true;
    // keep fetching more comments and replies while there is a nextPage token found in the response
    while (failSafe > 0 && morePages) {
      failSafe--;
      console.log("failSafe: ", failSafe);
      // this should always fire to start
      if (nextPage === "" || nextPage === undefined) {
        console.log("no next page");
        res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${params.videoid}&key=${process.env.GOOGLE_API}&maxResults=100`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        // this should happen if there are more pages
      } else {
        console.log("getting next page...");
        res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${params.videoid}&key=${process.env.GOOGLE_API}&maxResults=100&nextPage=${nextPage}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
      }

      console.log("got response...");
      const commentsOneVideo = await res.json();
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
      // store everything in the array at the top and in the database
      if (commentsOneVideo) {
        const commentsArr: StoreAllCommentsParams[] = [];
        const repliesArr: StoreAllRepliesParams[] = [];
        for (let item of commentsOneVideo.items) {
          commentsAndReplies.push(
            item.snippet.topLevelComment.snippet.textDisplay
          );
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
          });
          if (item.replies) {
            for (let reply of item.replies.comments) {
              commentsAndReplies.push(reply.snippet.textDisplay);
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
              });
            }
          }
        }
        await storeAllComments(token as string, commentsArr);
        await storeAllReplies(token as string, repliesArr);
      }
    }
  } catch (error) {
    console.error(error);
  }

  // fetch comments from database
  const commentsForSentament = [];
  const { data, error } = await getComments(
    token as string,
    params.videoid as string
  );
  if (data) {
    for (let comment of data) {
      commentsForSentament.push(comment.text_display);
    }
  } else {
    console.error(error);
  }

  // TODO: get sentiment from comments and replies:
  console.log(commentsAndReplies.join("\n"));
  //await getSentiment(commentsForSentament.join("\n") || "Hello");
  // TODO: get summary of captions
  await getVideoSummary(commentsForSentament.join("\n"));
  // TODO: get summary of replies
  // TODO: more details? line of advice?
  let captionsArr: StoreCaptionsParams[] = [];
  // fetch captions from YouTube API
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/captions?part=snippet&videoId=${params.videoid}&key=${process.env.GOOGLE_API}`,
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
        console.log(caption.id);
        const captionRes = await fetch(
          `https://youtube.googleapis.com/youtube/v3/captions/${caption.id}?key=${process.env.GOOGLE_API}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${userOAuth[0].token}`,
            },
          }
        );
        const captionText = await captionRes.text();
        console.log(captionText);
        console.error(captionRes.status, captionRes.statusText);
        captionsArr.push({
          id: caption.id,
          video_id: params.videoid,
          language: caption.snippet.language,
          name: caption.snippet.name,
          text: captionText,
          updatedAt: new Date(),
        });
      }
      await storeCaptions(token as string, captionsArr);
    }
  } catch (error) {
    console.error(error);
  }

  // from oneai
  // try {
  //   await getSentiments([
  //     "watching the Mom of the Year award being presented to Michelle Duggar and all the praise for her and Jim Bob part now in January 2022 really hits different lmao",
  //     "The white supremacy runs very clearly in American evangelicalism. I&#39;m reading a really good book called Unsettling Truths by Mark Charles and Soong-Chan Rah and I&#39;m learning so much. It&#39;s about the ongoing dehumanizing legacy of the doctrine of discovery. I&#39;m so glad for you and everyone else who stands up for love and stands against bigotry and homophobia and all the other phobias.",
  //   ]);
  // } catch (error) {
  //   console.error("unable to get sentiments 😭", error);
  // }

  return (
    <section>
      <h1>video id: {params.videoid}</h1>
      <div>
        {commentsAndReplies &&
          commentsAndReplies.map((text, i) => <p key={i}>{text}</p>)}
      </div>
      <div>
        {captionsArr &&
          captionsArr.map((caption, i) => (
            <div key={i}>
              <h3>{caption.text}</h3>
            </div>
          ))}
      </div>
    </section>
  );
}
