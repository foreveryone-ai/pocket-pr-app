import {
  PreProcessorA,
  createAnalysis,
  getAnalysis,
  getCommentsSentiment,
  getCommentsSummaries,
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
  // get summary and comments
  const { userId, getToken } = auth();
  const params = context.params;
  console.log(params.videoid);
  const token = await getToken({ template: "supabase" });

  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // return sentiment if it exists
  const { data: analData, error: analError } = await getAnalysis(
    token,
    params.videoid
  );
  if (
    analData &&
    analData.length > 0 &&
    (analData[0].sentiment_breakdown as string)
  ) {
    return NextResponse.json({
      message: analData[0].sentiment_breakdown as string,
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

  // process the comments into batches
  const pp = new PreProcessorA(comData as Comment[]);
  const batches = pp.preprocessComments();
  // send batches to langchain
  const pc = new PocketChain(summaryData[0].summaryText, batches);
  const comSummariesArr = await pc.processComments();
  console.log(`${comSummariesArr.length} summary objects`);
  if (!comSummariesArr || comSummariesArr.length === 0) {
    console.error("comment summaries array returning null or length 0");
    return NextResponse.json({ message: "Error: no comment summaries" });
  }
  // store comment summaries
  // TODO: find out why only some of the summaries are being stored
  try {
    await storeCommentsSummaries(token, comSummariesArr, params.videoid);
  } catch (error) {
    console.error("unable to store commentS summaries", error);
    return NextResponse.json({ message: "Error: Server issue" });
  }
  // get comment Summaries from db
  const { data: comSumData, error: comSumError } = await getCommentsSummaries(
    token,
    [""],
    params.videoid
  );
  if (comSumError || !comSumData || comSumData.length === 0) {
    console.error("something went wrong at get comment summaries");
    return NextResponse.json({
      message: "unable to get comment summaries from db",
    });
  }
  // create sentiment analysis
  const comSentiment = await getCommentsSentiment(token, params.videoid);
  if (!comSentiment) {
    console.error("getting comments sentiment from db returned null");
    return NextResponse.json({
      message: "Error: unable to retrieve comment sentiment",
    });
  }
  const sentimentBreakdownRes = await PocketChain.sentimentBreakdown(
    comSentiment
  );
  if (!sentimentBreakdownRes) {
    console.error("no response from getSentiment method in langchain");
    return NextResponse.json({
      message: "Error: unable to retrieve sentiment",
    });
  }
  // store the sentiment analysis
  await createAnalysis(token, userId, params.videoid, sentimentBreakdownRes);
  // return the sentiment analysis
  return NextResponse.json({ message: sentimentBreakdownRes });
}
