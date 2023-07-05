import StringHelpers from "@/helpers/stringHelpers";
import { storeCaptions } from "./supabaseClient";
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

async function getCaptions(videoId: string) {
  // fetch captions from YouTube API
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
              Authorization: `Bearer ${userOAuth[0].token}`,
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
          video_id: params.videoid as string,
          language: caption.snippet.language as string,
          captions: captionText as string,
          updatedAt: new Date(),
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
export { google, getOAuthData, getCaptions };
