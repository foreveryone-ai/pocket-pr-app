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
      // TODO: get type for item
      for (let item of commentsOneVideo.items) {
        commentsAndReplies.push(
          item.snippet.topLevelComment.snippet.textDisplay
        );
        if (item.replies) {
          for (let reply of item.replies) {
            commentsAndReplies.push(reply.comments.textDisplay);
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
