import {
  storeAllComments,
  storeAllReplies,
  type StoreAllCommentsParams,
  type StoreAllRepliesParams,
} from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";

export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  let commentsAndReplies = [];
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${params.videoid}&key=${process.env.GOOGLE_API}&maxResults=100`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("got response...");
    const commentsOneVideo = await res.json();
    console.log("next page token: ", commentsOneVideo.nextPageToken);
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
          like_count: item.snippet.topLevelComment.snippet.likeCount as number,
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
  } catch (error) {
    console.error(error);
  }

  return (
    <section>
      <h1>video id: {params.videoid}</h1>
      <div>
        {commentsAndReplies &&
          commentsAndReplies.map((text, i) => <p key={i}>{text}</p>)}
      </div>
    </section>
  );
}
