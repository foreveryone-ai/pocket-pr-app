import { NextResponse } from "next/server";
import ChannelChatUI from "@/app/components/ChatUI";
// to-do: write channel-chat/[channelid]route.ts
import { ChannelChain } from "@/lib/langChain";
import { auth, currentUser } from "@clerk/nextjs";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { getAllCaptionSummaries } from "@/lib/supabaseClient";

export default async function ChannelChatPage({
  params,
}: {
  params: { channelid: string };
}) {
  const { userId, getToken } = auth();
  console.log(userId);
  const token = await getToken({ template: "supabase" });

  let captions;

  if (!token) return NextResponse.rewrite("/sign-in");

  // Create an instance of ChannelChain
  const channelChain = new ChannelChain();

  // First, try to get the AllCaptionSummary from the database
  const { data: allCaptionSummaryData, error: allCaptionSummaryError } =
    await getAllCaptionSummaries(token, params.channelid);

  if (allCaptionSummaryError) {
    console.error(allCaptionSummaryError);
    return NextResponse.json({ message: "Error on chat" });
  }

  if (allCaptionSummaryData && allCaptionSummaryData.length > 0) {
    // If the AllCaptionSummary exists in the database, use it
    captions = allCaptionSummaryData[0].body;
  } else {
    // If the AllCaptionSummary does not exist in the database, call the summarizeSummaries method
    const { data: captionsData, error: captionsError } =
      await channelChain.summarizeSummaries(params.channelid);

    console.log("captionsSummary Data: ", captionsData);

    if (captionsError) {
      console.error(captionsError);
      return NextResponse.json({ message: "Error on chat" });
    }
    if (captionsData && captionsData.length > 0) {
      console.log("get captions summary on video id page!");
      captions = captionsData[0].summaryText;
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
        captionsSummary={captions}
        userName={userName}
      />
    </div>
  );
}
