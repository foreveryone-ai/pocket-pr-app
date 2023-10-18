// app/api/chat/[channelid]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import { ChannelChain } from "@/lib/langChain";

type Params = {
  params: {
    channelid: string;
  };
};

export async function POST(req: NextRequest, context: Params) {
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
      return await channelChat.chat(
        user.firstName as string,
        channelid,
        userData.message,
        userData.messageHistory
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
