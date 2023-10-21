// app/api/chat/[channelid]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import { ChannelChain } from "@/lib/langChain";
import { getAllCaptionSummary } from "@/lib/supabaseClient";

type Params = {
  params: {
    channelid: string;
  };
};

export async function POST(req: NextRequest, context: Params) {
  console.log("channel-chat/route method called");
  const channelid = context.params.channelid;
  const { userId, getToken } = auth();
  const userData = await req.json();

  console.log("user data: ", userData);

  const token = await getToken({ template: "supabase" });
  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // check for is embeddings exist in JWT metadata
  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    throw new Error("user not authorized");
  }

  if (user.privateMetadata.hasEmbeddings) {
    // if they exist we can call the chat method here and return the result
    const channelChat = new ChannelChain(userData.captionsSummary);
    console.log("calling chat after confirming embeddings");
    try {
      // return the return from chat
      const allCaptionSummaryData = await getAllCaptionSummary(
        token as string,
        channelid
      );
      const allCaptionsSummary =
        allCaptionSummaryData.data && allCaptionSummaryData.data.length > 0
          ? allCaptionSummaryData.data[0].body
          : "";

      // Pass allCaptionsSummary to the chat method
      return await channelChat.chat(
        user.firstName as string,
        channelid,
        userData.message,
        userData.messageHistory,
        allCaptionsSummary // Pass allCaptionsSummary here
      );
    } catch (error) {
      console.error("error on chat!", error);
      return NextResponse.error();
    }
  } else {
    // if embeddings do not exist in JWT metadata, return an error
    return NextResponse.error();
  }
}

export const runtime = "edge";
