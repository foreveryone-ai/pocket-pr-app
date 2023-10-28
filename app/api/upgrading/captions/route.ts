import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  getVideoIdsWithoutCaptionSummary,
  getCaptions,
  storeCaptionsSummary,
} from "@/lib/supabaseClient";
import { PocketChain } from "@/lib/langChain";

export async function POST(req: Request) {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  console.log("Executing upgrading/captions route");

  // Get all videoIds that do not have caption summary
  const videoIdsWithoutCaptionSummary = await getVideoIdsWithoutCaptionSummary(
    token as string,
    userId as string
  );

  if (!videoIdsWithoutCaptionSummary) {
    return NextResponse.json({
      message: "No videos without caption summary found",
    });
  }

  // Iterate over each videoId and fetch and store caption summary
  for (const videoId of videoIdsWithoutCaptionSummary) {
    const { data: videoCaptionData, error: videoCaptionError } =
      await getCaptions(token as string, videoId);

    if (videoCaptionError) {
      return NextResponse.json({ message: "Unable to retrieve captions" });
    }

    let pc;
    let channelId;
    if (videoCaptionData && videoCaptionData.length > 0) {
      // create summary of captions
      pc = new PocketChain(videoCaptionData[0].captions);
      channelId = videoCaptionData[0].channel_id; // Extract channel_id
    }

    if (!pc) {
      throw new Error("no video caption data");
    }

    const captions = await pc.summarizeCaptions();
    if (captions) {
      // Pass channel_id to storeCaptionsSummary
      await storeCaptionsSummary(
        token as string,
        videoCaptionData[0].id,
        captions,
        videoId,
        channelId
      );
    }
  }

  return NextResponse.json({ message: "success" });
}
