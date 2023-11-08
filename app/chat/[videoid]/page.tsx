// app/chat/[videoid]/page.tsx
import { NextResponse } from "next/server";
import ChatUI from "@/app/components/ChatUI";
import {
  createConversation,
  getAllAiChatMessages,
  getAllUserChatMessages,
  getCaptionSummary,
  getConversation,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import NavBar from "../../components/NavBar";

export default async function ChatPage({
  params,
}: {
  params: { videoid: string };
}) {
  let videoid;

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

  // Get the current user's name
  const user = await currentUser();
  const userName = user?.firstName;

  // get conversation
  let aiMessages, userMessages, conversationId;
  let allMessages: string[] = [];
  try {
    // is there a prior conversation?
    const convoRes = await getConversation(token, params.videoid);
    console.log(convoRes);
    if (convoRes && convoRes.data && convoRes.data.length > 0) {
      conversationId = convoRes.data[0].id;
      // get all AiChatMessage and UserChatMessage
      const chatRes = await getAllAiChatMessages(token, params.videoid);
      if (chatRes && chatRes.data && chatRes.data.length > 0) {
        aiMessages = chatRes.data; //reference?
      }
      if (chatRes && chatRes.error) {
        console.error(chatRes.error);
      }

      const userRes = await getAllUserChatMessages(token, params.videoid);
      if (userRes && userRes.data && userRes.data.length > 0) {
        userMessages = userRes.data; //reference?
      }
      if (userRes && userRes.error) {
        console.error(userRes.error);
      }
      if (userMessages && aiMessages) {
        // they should always be the same length
        if (userMessages.length !== aiMessages.length) {
          throw new Error(
            "User messages don't match up with ai messages. This should never happen"
          );
        }
        for (let i = 0; i < userMessages.length; i++) {
          allMessages.push(userMessages[i].content);
          allMessages.push(aiMessages[i].content);
        }
      }
    } else {
      console.log("creating new convo");
      // create a new conversation
      const newConversation = await createConversation(
        token,
        userId,
        captionsData[0].channel_id,
        params.videoid
      );
      console.log(newConversation);
      if (
        newConversation &&
        newConversation.data &&
        newConversation.data.length > 0
      ) {
        console.log("new conversation created");
        conversationId = newConversation.data[0].id;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <ChatUI
        videoid={params.videoid}
        captionsSummary={captions}
        userName={userName}
        chatHistory={allMessages}
        conversationId={conversationId}
        channelId={captionsData[0].channel_id}
      />
    </div>
  );
}
