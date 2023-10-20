// app/chat/[videoid]/page.tsx
import { NextResponse } from "next/server";
import ChatUI from "@/app/components/ChatUI";
import {
  getAllAiChatMessages,
  getAllUserChatMessages,
  getCaptionSummary,
  getConversation,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { getOrCreateChatHistory } from "@/lib/api";

export default async function ChatPage({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  console.log(userId);
  const token = await getToken({ template: "supabase" });

  if (!userId) {
    return <div>please login</div>;
  }

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
    console.log("got captions summary on video id page!");
    captions = captionsData[0].summaryText;
  }

  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  const { data: chatHistoryData, error: chatHistoryError } =
    await getOrCreateChatHistory(params.videoid);

  if (chatHistoryError) {
    console.error(chatHistoryError);
    return NextResponse.json({ message: "Error on chat" });
  }
  if (chatHistoryData && chatHistoryData.length > 0) {
    console.log("got captions summary on video id page!");
    captions = chatHistoryData[0].summaryText;
  }

  // Get the current user's name
  const user = await currentUser();
  const userName = user?.firstName;

  // get conversation
  let aiMessages, userMessages;
  try {
    const res = await getConversation(token, params.videoid);
    if (res && res.data && res.data.length > 0) {
      // get all AiChatMessage and UserChatMessage
      const res = await getAllAiChatMessages(token, params.videoid);
      if (res && res.data && res.data.length > 0) {
        aiMessages = [...res.data];
      }
      if (res && res.error) {
        console.error(res.error);
      }

      const userRes = await getAllUserChatMessages(token, params.videoid);
      if (userRes && userRes.data && userRes.data.length > 0) {
        userMessages = [...userRes.data];
      }
      if (userRes && userRes.error) {
        console.error(userRes.error);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-green-800">
      <NavBar />
      <ChatUI
        videoid={params.videoid}
        captionsSummary={captions}
        userName={userName}
      />
    </div>
  );
}
