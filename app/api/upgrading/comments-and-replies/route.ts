import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleApi } from "@/lib/googleApi";
import { getVideoIdsWithoutComments } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) NextResponse.rewrite("/sign-in");
  if (!userId) NextResponse.rewrite("/sign-in");

  console.log("Executing upgrading/comments-and-replies route");

  // Get all videoIds that do not have comments
  const videoIdsWithoutComments = await getVideoIdsWithoutComments(
    token as string,
    userId as string
  );

  if (!videoIdsWithoutComments) {
    return NextResponse.json({ message: "No videos without comments found" });
  }

  // Iterate over each videoId and fetch and store comments and replies
  for (const videoId of videoIdsWithoutComments) {
    try {
      await GoogleApi.getCommentsAndReplies(token as string, videoId);
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        message: `Unable to get Comments and Replies for videoId: ${videoId}`,
      });
    }
  }

  return NextResponse.json({ message: "success" });
}
