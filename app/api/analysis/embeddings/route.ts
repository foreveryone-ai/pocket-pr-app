import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  getComments,
  getCaptionSummary,
  updateVideoHasEmbeddings,
  getChannelIdByVideoId,
} from "@/lib/supabaseClient";
import { CreateEmbeddingsArgs, PocketChain } from "@/lib/langChain";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");
  if (!body || !body.videoid)
    //TODO: give proper status code
    return NextResponse.json({ message: "No video id included" });
  console.log("Executing embeddings route"); // Add this line
  //------------ get comments from db start ----------------//
  const { data: commentData, error: commentError } = await getComments(
    token as string,
    body.videoid
  );

  if (commentError) {
    return NextResponse.json({ message: "Unable create chat" });
  }
  if (commentData && commentData.length === 0) {
    throw new Error("we have no comments, or bananas!!");
    //return NextResponse.json({ message: "No comments to go on" });
  }
  //------------ get comments from db end ----------------//

  //--------------- check if caption summary exists start ------------------//
  const { data: videoCaptionSummaryData, error: videoCaptionSummaryError } =
    await getCaptionSummary(token as string, "", body.videoid);

  if (videoCaptionSummaryError) {
    return NextResponse.json({ message: "Problem retrieving caption summary" });
  }
  if (videoCaptionSummaryData && videoCaptionSummaryData.length === 0) {
    return NextResponse.json({ message: "Problem retrieving caption summary" });
  }
  //--------------- check if caption summary exists end ------------------//

  // check if embeddings exist
  const channelId = await getChannelIdByVideoId(token as string, body.videoid);
  console.log("Retrieved channelId: ", channelId);
  const pc = new PocketChain(videoCaptionSummaryData[0].summaryText, channelId);
  const hasEmbeddings = await pc.hasEmbeddings(body.videoid);
  console.log("We have embeddings? ", hasEmbeddings);

  if (hasEmbeddings) {
    // update bool on Video
    const { data: embedData, error: embedError } =
      await updateVideoHasEmbeddings(token as string, body.videoid, true);
    if (embedError) {
      throw new Error("error on check embeddings");
    }
    if (embedData && embedData.length > 0) {
      console.log("already have embeddings");
    }
    return NextResponse.json({ message: "Already have embeddings" });
  }

  // create objects for metadata
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

  const embeddingsCreated = await pc.createEmbeddings(comments);
  // toriaizu...
  if (embeddingsCreated) {
    // update the video table
    const { data: embedData, error: embedError } =
      await updateVideoHasEmbeddings(token as string, body.videoid, true);
    if (embedError) {
      throw new Error("error on check embeddings");
    }
    if (embedData && embedData.length > 0) {
      console.log("already have embeddings");
    }
    return NextResponse.json({
      message: "success",
    });
  } else {
    return NextResponse.json({
      message: "fail",
    });
  }
}
