import { google } from "googleapis";

async function getOAuthData(userId: string, provider: string) {
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
}

async function getCommentsFromVideo(videoId: string) {
  try {
    const myVideoId = "foKcZsIfxYs";
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${myVideoId}&key=${process.env.GOOGLE_API}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const commentsOneVideo = await res.json();
    if (commentsOneVideo) {
      // TODO: FIX THIS
      commentsOneVideo.items.map((item: any) =>
        console.log(item.replies.comments)
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export { google, getOAuthData, getCommentsFromVideo };
