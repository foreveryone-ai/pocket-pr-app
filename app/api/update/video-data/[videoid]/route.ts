import ClerkErrorHandler from "@/lib/error-handlers/clerkErrorHandler";
import { getCaptions } from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import { getOAuthData, GoogleApi } from "@/lib/googleApi";
import { NextResponse } from "next/server";

type Params = {
  params: {
    videoid: string;
  };
};
export async function GET(request: Request, context: Params) {
  let userOAuth;
  const params = context.params;
  const { userId, getToken } = auth();
  // const user = await currentUser();
  const token = await getToken({ template: "supabase" });

  if (userId && token) {
    console.log("getting Oauth for google");
    userOAuth = await getOAuthData(userId, "oauth_google");
    console.log("userOAuth", userOAuth);
    if (
      userOAuth.errors &&
      userOAuth?.errors[0].code === "oauth_missing_refresh_token"
    ) {
      console.error("Cannot refresh OAuth access token");
      ClerkErrorHandler.missingRefreshToken();
    }
  } else {
    console.error("no userId or token found");
    throw new Error("no userId or token found");
  }
  // check to see if captions are in database
  const captionsRes = await getCaptions(
    token as string,
    params.videoid as string
  );
  console.log("caption response", captionsRes);
  if (captionsRes.data?.length === 0) {
    console.log("There are no captions for this video.");
    if (token && params.videoid && userOAuth) {
      await GoogleApi.getCaptions(
        token as string,
        params.videoid as string,
        userOAuth[0].token as string
      );
    }
  } else if (captionsRes.data && captionsRes.data[0].captions) {
    console.log("Already have captions!");
  } else {
    console.error("There was an error getting captions from the DB");
    //TODO: handle error
  }

  //TODO: get comments and replies
  GoogleApi.getCommentsAndCaptions(token as string, params.videoid as string);

  return NextResponse.json({ message: "yay! from update/video-data" });
}
