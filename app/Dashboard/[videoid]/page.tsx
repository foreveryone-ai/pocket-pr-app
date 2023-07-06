import { getSentiment, getVideoSummary } from "@/lib/openai";
import {
  storeAllComments,
  storeAllReplies,
  storeCaptions,
  getCaptions,
  type StoreAllCommentsParams,
  type StoreAllRepliesParams,
  getComments,
  type StoreCaptionsParams,
  type CommentsResponseSuccess,
  type CommentsResponseError,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";

import { getOAuthData } from "@/lib/googleApi";

function removeTimestamps(caption: string): string {
  // Regular expression to match the timestamp pattern
  const timestampRegex =
    /\d{1,2}:\d{1,2}:\d{1,2}\.\d{3},\d{1,2}:\d{1,2}:\d{1,2}\.\d{3}/g;

  // Replace timestamps with an empty string
  return caption.replace(timestampRegex, "").trim();
}

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

  // Fetch comments from database
  try {
    const commentsAndReplies = [];

    // Get comments
    const { data: commentsData, error: commentsError } = await getComments(
      token as string,
      params.videoid as string
    );

    if (commentsData) {
      for (let comment of commentsData) {
        commentsAndReplies.push(comment.text_display);
      }
    } else {
      console.error(commentsError);
    }

    // Fetch captions from database
    const captionsArr: StoreCaptionsParams[] = [];

    // Get captions
    const { data: captionsData, error: captionsError } = await getCaptions(
      token as string,
      params.videoid as string
    );

    if (captionsData) {
      for (let caption of captionsData) {
        captionsArr.push({
          id: caption.id as string,
          video_id: caption.video_id as string,
          language: caption.language as string,
          captions: caption.captions as string,
          updatedAt: caption.updatedAt as Date,
        });
      }
    } else {
      console.error(captionsError);
    }

    return (
      <section>
        <h1>video id: {params.videoid}</h1>
        <div>
          {commentsAndReplies
            ? commentsAndReplies.map((text, i) => <p key={i}>{text}</p>)
            : "no comments or replies in db"}
        </div>
        <div>
          {captionsArr &&
            captionsArr.map((captions, i) => (
              <div key={i}>
                <h3>{captions.captions}</h3>
              </div>
            ))}
        </div>
      </section>
    );
  } catch (Error) {
    console.log(Error);
  }
}
