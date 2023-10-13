import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getOAuthData } from "@/lib/googleApi";
import { google } from "googleapis";
import { storeChannelId } from "@/lib/supabaseClient";

export async function GET() {
  // get credentials, get and store channel info
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  // create placeholders and update after recieving google token
  let userOAuth, yt, chList, youtube_channel_id;

  // if the call to clerk was successfull, get the oauth token from google
  // create the youtube client with the token recieved from clerk
  if (userId && token) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
      //   console.log("userOAuth on update", userOAuth);
      //   console.log("userOAuth at 0 on update", userOAuth[0]);
      //   console.log("userOAuth at 0 token on update", userOAuth[0].token);
    } catch (error) {
      return NextResponse.json({ message: "No oath found" });
    }
  }
  try {
    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Problem connecting to You Tube account",
    });
  }

  if (yt) {
    chList = await yt.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
      maxResults: 5,
    });
    const idList = chList?.data.items?.map((item) => item.id) || new Array(0);
    youtube_channel_id = idList.length > 0 ? idList[0] : "";
    console.log(youtube_channel_id, "youtube channel id");

    const channel_id = youtube_channel_id;
    // if the channel id was found, store it in the database
    if (youtube_channel_id && channel_id) {
      try {
        await storeChannelId(
          token as string,
          userId as string,
          youtube_channel_id,
          channel_id as string
        );
      } catch (error) {
        console.error("Error storing the channel ID: ", error);
        return NextResponse.json({ message: "Error: 123" });
      }
    }
  }

  return NextResponse.json({ message: "You Tube channel stored successfully" });
}
