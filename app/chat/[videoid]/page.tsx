import { NextResponse } from "next/server";
import ChatUI from "@/app/components/ChatUI";
import { getCaptionSummary } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";
import { useState } from "react";

export default async function ChatPage({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  console.log(userId);
  const token = await getToken({ template: "supabase" });

  let captions;

  if (!token) return NextResponse.rewrite("/sign-in");
  // get captions summary to send to
  const { data: captionsData, error: captionsError } = await getCaptionSummary(
    token,
    "",
    params.videoid
  );

  console.log("captionsSummary Data: ", captionsData);

  if (captionsError) {
    console.error(captionsError);
    return NextResponse.json({ message: "Error on chat" });
  }
  if (captionsData && captionsData.length > 0) {
    console.log("get captions summary on video id page!");
    captions = captionsData[0].summaryText;
  }

  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return <ChatUI videoid={params.videoid} captionsSummary={captions} />;
}
