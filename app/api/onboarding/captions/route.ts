import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { getVideosByUserId } from "@/lib/supabaseClient";

export async function GET() {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  // create placeholders and update after recieving google token
  let userOAuth, yt;

  if (userId && token) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      return NextResponse.json({ message: "No oath found" });
    }
  }

  try {
    const { data: videoData, error: videoError } = await getVideosByUserId(
      token as string,
      userId as string
    );
    if (videoError) {
      console.error(videoError);
      return NextResponse.json({ message: "Error on getVideosByUserId" });
    }
    if (videoData && videoData.length > 0) {
      console.log(`getting all captions for ${videoData.length} videos`);
      for (let video of videoData) {
        // Refresh the token
        //token = await getToken({ template: "supabase" });
        //userOAuth = await getOAuthData(userId as string, "oauth_google"); // Refresh the userOAuth
        await GoogleApi.getCaptions(
          token as string,
          video.id,
          userOAuth[0].token,
          video.channel_id as string
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error on get captions" });
  }
  return NextResponse.json({ message: "video captions have been added!" });
}
