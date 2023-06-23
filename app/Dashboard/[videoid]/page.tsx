import { getModels } from "@/lib/openai";
import {
  storeAllComments,
  storeAllReplies,
  type StoreAllCommentsParams,
  type StoreAllRepliesParams,
  getComments,
  type CommentsResponseSuccess,
  type CommentsResponseError,
} from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";

export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  const { /*userId*/ getToken } = auth();
  const token = await getToken({ template: "supabase" });

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
  const { data, error } = await getComments(
    token as string,
    params.videoid as string
  );
  if (data) {
    console.log("get all comments: ", data);
  } else {
    console.error(error);
  }

  // TODO: get sentiment from comments and replies:
  await getModels();
  // TODO: get summary of captions
  // TODO: get summary of replies
  // TODO: more details? line of advice?

  return (
    <section>
      <h1>video id: {params.videoid}</h1>
      <div>
        {/* {commentsAndReplies &&
          commentsAndReplies.map((text, i) => <p key={i}>{text}</p>)} */}
      </div>
    </section>
  );
}
