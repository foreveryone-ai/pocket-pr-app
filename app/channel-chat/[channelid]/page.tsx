import { NextResponse } from "next/server";
import ChannelChatUI from "@/app/components/ChannelChatUI";
import { ChannelChain } from "@/lib/langChain";
import { auth, currentUser } from "@clerk/nextjs";
import NavBar from "../../components/NavBar";
import { getAllCaptionSummary } from "@/lib/supabaseClient";

export default async function ChannelChatPage({
  params,
}: {
  params: { channelid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  let allCaptionSummary;

  if (!token) return NextResponse.rewrite("/sign-in");

  // Create an instance of ChannelChain
  const channelChain = new ChannelChain();

  // First, try to get the AllCaptionSummary from the database
  const allCaptionSummaryResult = await getAllCaptionSummary(
    token,
    params.channelid
  );

  if (
    Array.isArray(allCaptionSummaryResult) &&
    allCaptionSummaryResult.length > 0
  ) {
    // If the AllCaptionSummary exists in the database, use it
    allCaptionSummary = allCaptionSummaryResult[0].body;
  } else {
    // If the AllCaptionSummary does not exist in the database, call the summarizeSummaries method
    const summarizedSummariesResult = await channelChain.summarizeSummaries(
      params.channelid
    );

    if (
      Array.isArray(summarizedSummariesResult) &&
      summarizedSummariesResult.length > 0
    ) {
      allCaptionSummary = summarizedSummariesResult[0].summaryText;
    }
  }

  // Get the current user's name
  const user = await currentUser();
  const userName = user?.firstName;

  return (
    <div className="min-h-screen bg-green-800">
      <NavBar />
      <ChannelChatUI
        channelid={params.channelid}
        allCaptionSummary={allCaptionSummary}
        userName={userName}
      />
    </div>
  );
}
