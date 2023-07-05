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
  let userOAuth, gapi;
  const params = context.params;
  const { userId, getToken } = auth();
  // const user = await currentUser();
  const token = await getToken({ template: "supabase" });

  if (userId && token) {
    userOAuth = await getOAuthData(userId, "oauth_google");
    if (userOAuth) {
      gapi = new GoogleApi(token, userOAuth);
    } else {
      console.error("no userOauth found");
    }
  } else {
    console.error("no userId or token found");
  }
  // check to see if captions are in database
  const captionsRes = await getCaptions(token as string, params.videoid);
  console.log("caption response", captionsRes);
  if (captionsRes.data?.length === 0) {
    console.log("There are no captions for this video.");
    //TODO: call google for captions
    await gapi?.getCaptions(params.videoid);
  } else if (captionsRes.data && captionsRes.data?.length > 0) {
    console.log("Already have captions!");
    //TODO: call supabase for captions
  } else {
    console.error("There was an error getting captions from the DB");
    //TODO: handle error
  }
  return NextResponse.json({ message: "yay! from update/video-data" });
}
