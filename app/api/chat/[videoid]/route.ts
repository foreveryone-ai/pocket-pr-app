import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import { PocketChain } from "@/lib/langChain";

type Params = {
  params: {
    videoid: string;
  };
};

export async function POST(req: NextRequest, context: Params) {
  const videoid = context.params.videoid;
  const { userId, getToken } = auth();
  const userData = await req.json();

  const token = await getToken({ template: "supabase" });
  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // check for is embeddings exist in JWT metadata
  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    throw new Error("user not authorzed");
  }
  if (user.privateMetadata.hasEmbeddings) {
    // if they exist we can call the chat method here and return the result
    const pocketChat = new PocketChain(userData.captionsSummary);
    try {
      // return the return from chat
      return await pocketChat.chat(
        user.firstName as string,
        videoid,
        userData.message,
        userData.messageHistory
      );
    } catch (error) {
      throw new Error("error on chat!");
    }
  }

  // check if embeddings exist
  const pocketChain = new PocketChain(userData.captionsSummary);
  const hasEmbeddings = await pocketChain.hasEmbeddings(videoid);

  // set private metadata in jwt to varify embeddings are present
  if (hasEmbeddings) {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        hasEmbeddings: true,
      },
    });

    await pocketChain.chat(
      user.firstName as string,
      videoid,
      userData.message,
      userData.chatHistory
    );
  }
  // if embeddings, start chat

  // otherwise, create embeddings

  return NextResponse.json({ message: "token should now have embeddings..." });
}

export const runtime = "edge";
