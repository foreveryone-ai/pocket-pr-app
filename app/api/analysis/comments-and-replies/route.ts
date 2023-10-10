import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi, getOAuthData } from "@/lib/googleApi";
import { getComments } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");
  if (!body || !body.videoid)
    return NextResponse.json({ message: "No video id included" });
  console.log("Executing comments-and-replies route"); // Add this line
  //--------- check if comments already exist start-------------//
  const { data: commentData, error: commentError } = await getComments(
    token as string,
    body.videoid
  );

  if (commentError) {
    return NextResponse.json({ message: "Unable to get comments" });
  }
  if (commentData && commentData.length > 0) {
    return NextResponse.json({ message: "Already have comments" });
  }
  //--------- check if comments already exist end-------------//

  try {
    await GoogleApi.getCommentsAndReplies(token as string, body.videoid);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to get Comments and Replies" });
  }
}
