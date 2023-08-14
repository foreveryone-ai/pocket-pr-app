import {
  PreProcessorA,
  createAnalysis,
  getAnalysis,
  getCommentsSentiment,
  getCommentsSummaries,
  getDataForEmotionalAnalysis,
  storeCommentsSummaries,
} from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";
import { getCaptionSummary, getComments } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import type { Comment } from "@/lib/supabaseClient";
import { PocketChain } from "@/lib/langChain";

type Params = {
  params: {
    videoid: string;
  };
};

export async function GET(request: Request, context: Params) {
  let haveSentiment;
  // get summary and comments
  const { userId, getToken } = auth();
  const params = context.params;
  console.log(params.videoid);
  const token = await getToken({ template: "supabase" });

  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // return emotional breakdown if it exists
  const { data: analData, error: analError } = await getAnalysis(
    token,
    params.videoid
  );
  if (analError) {
    console.error("error getting analysis", analError);
    return NextResponse.json({ message: "error getting analysis" });
  }
  if (
    analData &&
    analData.length > 0 &&
    (analData[0].emotional_breakdown as string)
  ) {
    return NextResponse.json({
      message: analData[0].emotional_breakdown as string,
    });
  }
  // check if sentiment exists
  if (analData && analData.length > 0 && analData[0].sentiment) {
    haveSentiment = true;
  }
  // in the case the we already have sentiment, but not the breakdown
  // means we already have comment summaries
  // TODO: make new call to supabase
  const dfea = await getDataForEmotionalAnalysis(token, params.videoid);
  if (!dfea || dfea.length === 0) {
    return NextResponse.json({
      message: "Error: problem getting emotional analysis",
    });
  }

  // check if video summary is in db
  const { data: summaryData, error: summaryError } = await getCaptionSummary(
    token,
    "",
    params.videoid
  );

  if (!summaryData || summaryData.length === 0 || summaryError) {
    return NextResponse.json({
      message:
        "No summary, try hitting the update button to make sure we have your video summary",
    });
  }

  // check if comments are in db
  const { data: comData, error: comError } = await getComments(
    token,
    params.videoid
  );

  if (!comData || comData.length === 0 || comError) {
    return NextResponse.json({
      message:
        "No comments, try hitting the update button to make sure we have all of the comments.",
    });
  }
  // check if embeddings exist
  const pc = new PocketChain(summaryData[0].summaryText);
  const he = await pc.hasEmbeddings(params.videoid);
  console.log(he);

  // create or search embeddings
  // first parameter is everything need from supabase to do the analysis
  // second param. If false, they need to be stored in vectorStore.

  // toriaizu...
  return NextResponse.json({
    message: await pc.emotionalAnalysis(dfea, he === true),
  });
  // check if analysis exists
  // create emotional_breakdown in analysis if it does not exist
}
