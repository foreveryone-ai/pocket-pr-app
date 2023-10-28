import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { storeChatMessages } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { userId, getToken } = auth();
  const { videoid, conversationId, userMessage, aiMessage, channelId } =
    await req.json();

  const token = await getToken({ template: "supabase" });
  // send to sign-in if there is no token
  if (!token)
    return NextResponse.json({ error: "need to log in" }, { status: 401 });
  if (!userId)
    return NextResponse.json(
      { error: "need to be logged in" },
      { status: 401 }
    );

  try {
    const res = await storeChatMessages(
      token,
      conversationId,
      userMessage,
      aiMessage,
      userId,
      channelId,
      videoid
    );

    if (res && res.length > 0) {
      return NextResponse.json({}, { status: 201 });
    } else {
      return NextResponse.json({}, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
