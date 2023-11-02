import { NextResponse } from "next/server";
import ChannelChatUI from "@/app/components/ChannelChatUI";
import { auth, currentUser } from "@clerk/nextjs";
import NavBar from "../../components/NavBar";
import {
  createConversation,
  getAllAiChatMessages,
  getAllUserChatMessages,
  getConversation,
} from "@/lib/supabaseClient";

export default async function ChannelChatPage({
  params,
}: {
  params: { channelid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  //TODO: I think maybe router.redirect or router.rewrite here
  // TODO: import {Router} from "next/navigation"?
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) throw new Error("what happened here?!");

  // Get the current user's name
  const user = await currentUser();
  const userName = user?.firstName;

  let aiMessages, userMessages, conversationId;
  let allMessages: string[] = [];
  try {
    // Really??
    const convoRes = await getConversation(token, undefined, params.channelid);
    console.log("convoRes", convoRes);
    if (convoRes && convoRes.data && convoRes.data.length > 0) {
      console.log("got convo...");
      console.log(convoRes.data);
      conversationId = convoRes.data[0].id;
      // get all AiChatMessage and UserChatMessage
      const chatRes = await getAllAiChatMessages(
        token,
        undefined,
        params.channelid,
        conversationId
      );
      if (chatRes && chatRes.data && chatRes.data.length > 0) {
        aiMessages = chatRes.data; //reference?
      }
      if (chatRes && chatRes.error) {
        console.error(chatRes.error);
      }

      const userRes = await getAllUserChatMessages(
        token,
        undefined,
        params.channelid,
        conversationId
      );
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
        params.channelid
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
      <ChannelChatUI
        channelid={params.channelid}
        userName={userName}
        chatHistory={allMessages}
        conversationId={conversationId}
      />
    </div>
  );
}
