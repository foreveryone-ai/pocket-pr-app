import type {
  StoreAllCommentsParams,
  StoreAllRepliesParams,
} from "@/lib/supabaseClient";

export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  let commentsAndReplies = [];
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${params.videoid}&key=${process.env.GOOGLE_API}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("got response...");
    const commentsOneVideo = await res.json();
    console.log(commentsOneVideo);
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
        });
        if (item.replies) {
          for (let reply of item.replies) {
            commentsAndReplies.push(reply.comments.textDisplay);
            repliesArr.push({
              id: reply.comments.id as string,
              reply_id: reply.comments.id as string,
              text_display: reply.comments.textDisplay as string,
              like_count: reply.comments.likeCount as number,
              published_at: reply.comments.publishedAt as Date,
              comment_id: item.snippet.topLevelComment.id as string,
              author_display_name: reply.comments.snippet
                .authorDisplayName as string,
              author_image_url: reply.comments.snippet
                .authorProfileImageUrl as string,
            });
          }
        }
      }
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
