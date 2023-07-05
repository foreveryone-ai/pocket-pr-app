import { StoreCaptionsParams } from "./supabaseClient";
import StringHelpers from "@/helpers/stringHelpers";
import { storeCaptions } from "./supabaseClient";

export async function getOAuthData(userId: string, provider: string) {
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

export class GoogleApi {
  token: string;
  userOAuth: string;

  constructor(token: string, userOauth: string) {
    this.token = token;
    this.userOAuth = userOauth;
    console.log(
      `gapi object created with token: ${token} and userOauth: ${userOauth}`
    );
  }

  async getCaptions(videoId: string) {
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
                //TODO: 401 unauthorized here
                Authorization: `Bearer ${this.userOAuth}`,
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
          });
        }
        await storeCaptions(this.token as string, captionsArr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
    }
  }
}
