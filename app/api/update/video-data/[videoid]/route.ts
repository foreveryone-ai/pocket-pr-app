import { getCaptions } from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";
import { getOAuthData, google } from "@/lib/googleApi";
import { NextResponse } from "next/server";

type Params = {
  params: {
    videoid: string;
  };
};
export async function GET(request: Request, context: Params) {
  const params = context.params;
  const { userId, getToken } = auth();
  // const user = await currentUser();
  const token = await getToken({ template: "supabase" });
  const captionsRes = await getCaptions(token as string, params.videoid);
  console.log("caption response", captionsRes);
  if (captionsRes.data?.length === 0) {
    console.log("There are no captions for this video.");
  } else if (captionsRes.data && captionsRes.data?.length > 0) {
    console.log("Already have captions!");
  } else {
    console.error("There was an error getting captions from the DB");
  }
  return NextResponse.json({ message: "yay! from update/video-data" });
}
