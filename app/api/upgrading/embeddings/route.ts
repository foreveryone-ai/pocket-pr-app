import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  getAllCommentsByUserId,
  updateVideoHasEmbeddings,
  getChannelIdByVideoId,
} from "@/lib/supabaseClient";
import { CreateEmbeddingsArgs, PocketChain } from "@/lib/langChain";

export async function POST(req: Request) {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  console.log("Executing embeddings route");

  // get all comments for the user
  const commentData = await getAllCommentsByUserId(
    token as string,
    userId as string
  );

  if (!commentData || commentData.length === 0) {
    return NextResponse.json({ message: "no comments to go on" });
  }

  // createe objects for metadata
  const comments: CreateEmbeddingsArgs[] = [];

  for (let comment of commentData) {
    comments.push({
      video_id: comment.video_id,
      id: comment.id,
      author_display_name: comment.author_display_name,
      author_image_url: comment.author_image_url,
      text_display: comment.text_display,
      like_count: comment.like_count,
      channelId: comment.channel_id,
    });
  }

  // Create embeddings for each comment
  for (let comment of comments) {
    const channelId = await getChannelIdByVideoId(
      token as string,
      comment.video_id
    );
    const pc = new PocketChain("", channelId);
    const embeddingsCreated = await pc.createEmbeddings([comment]);

    if (embeddingsCreated) {
      // update the video table
      await updateVideoHasEmbeddings(token as string, comment.video_id, true);
    } else {
      return NextResponse.json({
        message: "Failed to create embeddings for comment: " + comment.id,
      });
    }
  }

  return NextResponse.json({ message: "success" });
}
