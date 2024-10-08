import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  getCaptionSummary,
  getCaptions,
  storeCaptionsSummary,
} from "@/lib/supabaseClient";
import { PocketChain } from "@/lib/langChain";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, getToken } = auth();

  let token = await getToken({ template: "supabase" });
  let pc;

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");
  if (!body || !body.videoid) throw new Error("No video id included");

  //--------------- check if caption summary already exists start ------------------//
  const { data: videoCaptionSummaryData, error: videoCaptionSummaryError } =
    await getCaptionSummary(token as string, "", body.videoid);

  if (videoCaptionSummaryError) {
    throw new Error("error on caption summary");
  }
  if (videoCaptionSummaryData && videoCaptionSummaryData.length > 0) {
    return NextResponse.json({ message: "Already have caption summary" });
  }
  //--------------- check if caption summary already exists end ------------------//

  const { data: videoCaptionData, error: videoCaptionError } =
    await getCaptions(token as string, body.videoid);

  if (videoCaptionError) {
    return NextResponse.json({ message: "Unable to retrieve captions" });
  }

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
      body.videoid,
      channelId
    );
    return NextResponse.json({ message: "success" });
  }
}
