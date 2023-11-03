import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getChannelIdByUserId } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { userId, getToken } = auth();

  let token = await getToken({ template: "supabase" });

  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  const channelId = await getChannelIdByUserId(
    token as string,
    userId as string
  );

  if (!channelId) {
    return NextResponse.json({ message: "No channel id found for this user" });
  }

  return NextResponse.json({ channelId });
}
