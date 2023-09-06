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
  if (!body || !body.videoid)
    return NextResponse.json({ message: "No video id included" });

  //--------------- check if caption summary already exists start ------------------//
  const { data: videoCaptionSummaryData, error: videoCaptionSummaryError } =
    await getCaptionSummary(token as string, "", body.videoid);

  if (videoCaptionSummaryError) {
    return NextResponse.json({ message: "Problem retrieving caption summary" });
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

  if (videoCaptionData && videoCaptionData.length > 0) {
    // create summary of captions
    pc = new PocketChain(videoCaptionData[0].captions);
  }

  if (!pc) {
    return NextResponse.json({ message: "Unable to create summary" });
  }

  const captions = await pc.summarizeCaptions();
  if (captions) {
    await storeCaptionsSummary(
      token as string,
      videoCaptionData[0].id,
      captions,
      body.videoid
    );
    return NextResponse.json({ message: "success" });
  }

  return NextResponse.json({ message: "Unable to process caption summary" });
}
