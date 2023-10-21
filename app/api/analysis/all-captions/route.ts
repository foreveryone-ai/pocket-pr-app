import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  getAllCaptionSummary,
  storeAllCaptionSummary,
  getMostRecentCaptionSummary,
} from "@/lib/supabaseClient";
import { ChannelChain } from "@/lib/langChain";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  const { userId, getToken } = auth();

  let token = await getToken({ template: "supabase" });
  let cc;

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");
  if (!body || !body.channelid) throw new Error("No channel id included");

  //--------------- check if all caption summary already exists start ------------------//
  const allCaptionSummaryData = await getAllCaptionSummary(
    token as string,
    body.channelid
  );

  // Fetch the most recent CaptionSummary for the given channel_id
  // Fetch the most recent CaptionSummary for the given channel_id
  const mostRecentCaptionSummary = await getMostRecentCaptionSummary(
    token as string,
    body.channelid
  );

  // If an AllCaptionSummary already exists and the most recent CaptionSummary is not more recent, return a message
  // If an AllCaptionSummary already exists and the most recent CaptionSummary is not more recent, return a message
  if (
    allCaptionSummaryData.data &&
    allCaptionSummaryData.data.length > 0 &&
    mostRecentCaptionSummary && // Check if mostRecentCaptionSummary is not null
    mostRecentCaptionSummary.createdAt <=
      allCaptionSummaryData.data[0].created_at
  ) {
    return NextResponse.json({ message: "Already have all caption summary" });
  }
  //--------------- check if all caption summary already exists end ------------------//

  cc = new ChannelChain();

  const allCaptionsSummary = await cc.summarizeSummaries(body.channelid);
  if (allCaptionsSummary) {
    // Store allCaptionsSummary
    await storeAllCaptionSummary(
      token as string,
      allCaptionsSummary,
      body.channelid
    );
    return NextResponse.json({ message: "success" });
  }
}
