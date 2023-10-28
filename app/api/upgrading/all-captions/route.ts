import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { storeAllCaptionSummary } from "@/lib/supabaseClient";
import { ChannelChain } from "@/lib/langChain";

export async function POST(req: Request) {
  console.log("upgrading/all-captions method called");
  const body = await req.json();
  console.log(body);
  const { userId, getToken } = auth();

  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");
  if (!body || !body.channelid) throw new Error("No channel id included");

  console.log("Passed channelId: ", body.channelid);

  // Create an instance of ChannelChain and call the summarizeSummaries method
  const channelChain = new ChannelChain();
  const allCaptionsSummary = await channelChain.summarizeSummaries(
    body.channelid
  );

  if (allCaptionsSummary) {
    // Store allCaptionsSummary
    await storeAllCaptionSummary(
      token as string,
      allCaptionsSummary,
      body.channelid
    );
    return NextResponse.json({ message: "success" });
  } else {
    return NextResponse.json({ message: "Failed to create AllCaptionSummary" });
  }
}
