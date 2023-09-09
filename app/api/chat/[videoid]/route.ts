import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import { getCaptionSummary } from "@/lib/supabaseClient";
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

  console.log("user data: ", userData);

  const token = await getToken({ template: "supabase" });
  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // check for is embeddings exist in JWT metadata
  const user = await clerkClient.users.getUser(userId);
  if (user.privateMetadata.hasEmbeddings) {
    // if they exist we can call the chat method here and return the result
    const pocketChat = new PocketChain(userData.captionsSummary);
    console.log("calling chat after confirming embeddings on line 28");
    console.log("captions passed to api: ", userData.captions);
    try {
      const chatResponse = await pocketChat.chat(
        videoid,
        userData.message,
        userData.messageHistory
      );
      return NextResponse.json({ message: chatResponse });
    } catch (error) {
      return NextResponse.json({ message: "error on chat response" });
    }
  }

  // check if video summary is in db
  // const { data: summaryData, error: summaryError } = await getCaptionSummary(
  //   token,
  //   "",
  //   videoid
  // );

  // if (!summaryData || summaryData.length === 0 || summaryError) {
  //   return NextResponse.json({
  //     message:
  //       "No summary, try hitting the update button to make sure we have your video summary",
  //   });
  // }

  // check if embeddings exist
  const pocketChain = new PocketChain(userData.captionsSummary);
  const hasEmbeddings = await pocketChain.hasEmbeddings(videoid);
  console.log(hasEmbeddings);

  // set private metadata in jwt to varify embeddings are present
  if (hasEmbeddings) {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        hasEmbeddings: true,
      },
    });

    console.log("sending to pocketChain chat()...");
    await pocketChain.chat(videoid, userData.message, userData.chatHistory);
  }
  // if embeddings, start chat

  // otherwise, create embeddings

  return NextResponse.json({ message: "token should now have embeddings..." });
}
