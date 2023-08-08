import type { EmotionalAnalysisArgs } from "@/lib/langChain";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  PreProcessorA,
  getCaptions,
  getVideo,
  type Comment,
  getComments,
  type StoreCaptionsParams,
  type CommentsResponseSuccess,
  type CommentsResponseError,
  SmallComment,
  storeCaptionsSummary,
  getCaptionSummary,
  getCommentsSummaries,
  storeCommentsSummaries,
  getCommentsSentiment,
  getAnalysis,
  getDataForEmotionalAnalysis,
  createAnalysis,
} from "@/lib/supabaseClient";
import { auth, currentUser } from "@clerk/nextjs";

import { getOAuthData } from "@/lib/googleApi";
import { PocketChain } from "@/lib/langChain";
// we are assuming that we have comments and captions already store in our db
//TODO: will need an update button if captions or comments are not in db
export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });
  console.log("token...");
  console.log(token);

  let userOAuth,
    pocketChain,
    batches,
    preprocessor,
    capSummary,
    analysis,
    comSummary,
    vidData,
    comData,
    capData,
    summariesForEmotionalAnalysis,
    sentiment;

  if (userId) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      console.error("no oauth found ", error);
    }
  }

  if (!token) {
    console.log("no token found, redirect to /sign-in");
    redirect("/sign-in");
  }
  const mockCategoriesMiddle = [
    {
      heading: "Sentiment Breakdown",
      description:
        "This category provides a detailed breakdown of the sentiment expressed in the video's comments. It shows the percentage of positive, negative, and neutral comments, as well as the most common words and phrases used in each sentiment category.",
    },
    {
      heading: "Emotional Analysis",
      description:
        "This category analyzes the emotional content of the video itself, using facial recognition software to detect emotions in the speaker's face. It also analyzes the tone of voice, body language, and other nonverbal cues to provide a comprehensive emotional analysis.",
    },
    {
      heading: "Conflict Detection",
      description:
        "This category identifies potential areas of conflict in the video and its comments. It uses natural language processing (NLP) to detect words and phrases that are associated with conflict, as well as patterns of interaction between commenters.",
    },
    {
      heading: "Conflict Resolution Suggestions",
      description:
        "This category provides practical suggestions for resolving conflicts that were identified in the Conflict Detection category. It draws on research in conflict resolution and communication to provide actionable steps that viewers can take to resolve conflicts in their own lives.",
    },
    {
      heading: "Popular Topics",
      description:
        "This category identifies the most popular topics discussed in the video and its comments. It provides a word cloud or other visual representation of the most common words and phrases, as well as a breakdown of the most popular topics by category (e.g., politics, religion, social issues).",
    },
  ];

  const mockCategoriesRight = [
    {
      heading: "Content Suggestions",
      description:
        "This category provides suggestions for related content that viewers might be interested in based on the topic of the video. It uses machine learning algorithms to analyze the content of the video and its comments to identify related topics and suggest other videos or channels that cover similar topics.",
    },
    {
      heading: "Engagment Opportunities",
      description:
        "This category provides opportunities for engagement with the video and its content. It suggests ways that viewers can participate in the conversation, such as by leaving a comment, sharing the video on social media, or participating in a related discussion group.",
    },
    {
      heading: "Notable Comments",
      description:
        "This category highlights comments that are particularly noteworthy or insightful. It uses NLP to identify comments that are well-written, thought-provoking, or that add value to the conversation, and presents them in an easy-to-read format.",
    },
    {
      heading: "Influencer Identification",
      description:
        "This category identifies influencers in the video's niche who might be worth following or reaching out to. It uses machine learning to analyze the video's content and comments to identify users who are particularly active or influential in the niche, and provides information about their social media profiles and other relevant information.",
    },
    {
      heading: "Tone of Communication",
      description:
        "This category analyzes the tone of communication in the video and its comments. It uses NLP to detect the tone of comments and the video itself, and provides an overview of the most common tones (e.g., angry, sarcastic, humorous). It also provides suggestions for how to adjust the tone of communication to improve the conversation.",
    },
  ];

  // show analysis if it exists. return here.
  analysis = await getAnalysis(token, params.videoid);
  if (analysis && analysis.data && analysis.data.length > 0) {
    console.log("got analysis");
    console.log(analysis);
    //TODO: return the page here, after getting the video stuff
    vidData = await getVideo(token as string, params.videoid as string);
    successDisplay(vidData);
  }

  // captions summary exist?
  capSummary = await getCaptionSummary(token, "", params.videoid);
  if (capSummary && capSummary.data && capSummary.data.length > 0) {
    console.log("got cap summary");
    console.log(capSummary);
  }

  // comments summary exists?
  const { data: comSummaryData, error: comSummaryError } =
    await getCommentsSummaries(token, [], params.videoid);
  if (comSummaryError) {
    console.error(comSummaryError);
  } else {
    console.log("got comment summaries");
    comSummary = comSummaryData;
  }

  // if both exist, but there is not analysis, create analysis and
  // return
  if (
    comSummary &&
    comSummary.length > 0 &&
    capSummary &&
    capSummary.data &&
    capSummary.data.length > 0
  ) {
    // pass dummy params??
    pocketChain = new PocketChain(capSummary.data[0] as unknown as string, [
      [
        {
          comment_id: "",
          text_display: "",
          like_count: 0,
          author_display_name: "",
        },
      ],
    ]);
    sentiment = await getCommentsSentiment(token as string, params.videoid);
    if (sentiment) {
      console.log("sentiment breakdown: ");
      const sentimentRes = await PocketChain.sentimentBreakdown(sentiment);
      console.log(sentimentRes);
      console.log("emotional analysis: ");
      const emoData = await getDataForEmotionalAnalysis(token, params.videoid);
      console.log("emoData ", emoData);
      if (emoData && emoData.length > 0) {
        await pocketChain.emotionalAnalysis(sentimentRes, emoData);
      }

      console.log("create analysis");
      const analysisRes = await createAnalysis(
        token,
        userId as string,
        params.videoid,
        sentimentRes
      );

      console.log("created analysis!");
      console.log(analysisRes);
      return <>create analysis</>;
      //successDisplay(vidData);
    }
  }

  //--------------------no cap/com summaries---------------------//

  // Get comments data and store in comData, otherwide comSummary already
  // exists
  if (!comSummary || comSummary.length === 0) {
    console.log("no comment summaries in database");

    //comments and replies will be stored here

    const { data: commentsData, error: commentsError } = await getComments(
      token as string,
      params.videoid as string
    );
    console.log("commentsData...");
    console.log(commentsData);

    if (commentsData && commentsData.length > 0) {
      console.log("comments data");
      // dumb copying going on here..
      comData = commentsData.map((item) => item);
      console.log("comData length is: ", comData.length);
    } else if (commentsError) {
      console.error(commentsError);
      return <>{commentsError}</>;
    } else {
      return <>no comments, need to hit the update button</>;
    }
  }
  const captionsArr: StoreCaptionsParams[] = [];

  // if there are no capSummaries, get them from db and save to
  // capData. Otherwise, need to update captions
  if (capSummary && capSummary.data && capSummary.data.length === 0) {
    // Get captions
    console.log("No capSummaries found. Fetching captions");
    const { data: captionsData, error: captionsError } = await getCaptions(
      token as string,
      params.videoid as string
    );

    if (captionsData && captionsData.length > 0) {
      console.log("got captions data...");
      capData = [...captionsData];

      captionsArr.push({
        id: captionsData[0].id as string,
        video_id: captionsData[0].video_id as string,
        language: captionsData[0].language as string,
        captions: captionsData[0].captions as string,
        updatedAt: captionsData[0].updatedAt as Date,
      });
    } else if (captionsError) {
      throw new Error("Error getting captions from database");
    } else {
      console.log("no caption data, need to hit the update buttons");
      return <>no caption data, need to hit the update button</>;
    }
  }

  // if there are no capSummay, but there is capData
  // send to pocketChain store capSummary in DB
  if (
    capSummary &&
    capSummary.data &&
    capSummary.data.length === 0 &&
    capData
  ) {
    console.log("sending to PocketChain...");
    pocketChain = new PocketChain(
      (capData[0].captions as string).replace(/\n/, ""),
      [
        [
          {
            comment_id: "",
            text_display: "",
            like_count: 0,
            author_display_name: "",
          },
        ],
      ]
    );
    capSummary = await pocketChain.summarizeCaptions();
    console.log("captionsId: ", capData[0].id);
    console.log("captions summary: ", capSummary);
    try {
      // store in db
      const storeCapRes = await storeCaptionsSummary(
        token as string,
        capData[0].id as string,
        capSummary && capSummary.text,
        params.videoid
      );
      console.log("store cap res: ", storeCapRes);
    } catch (error) {
      console.error("unable to store caption summary in db");
      console.error(error);
    }
  }
  // if comData,
  if (comData && comData.length > 0) {
    console.log("Preprocess comments...");
    console.log("got comments data");
    preprocessor = new PreProcessorA(comData as Comment[]);
    batches = preprocessor.preprocessComments();
    console.log("batches created...");
    console.log("captionsData...");
    if (!pocketChain && capSummary) {
      pocketChain = new PocketChain(
        capSummary.data[0] as unknown as string,
        batches
      );
      console.log("processing comments...");
      const commentsRes = await pocketChain.processComments();
      console.log("commentsRes.length = ", commentsRes.length);
      if (commentsRes.length > 0) {
        // store everything
        // create comment summaries
        try {
          console.log("storing comment summaries...");
          const commentsSummaryRes = await storeCommentsSummaries(
            token as string,
            commentsRes,
            params.videoid
          );
          console.log("comments summaries stored succesfully!");
          console.log(commentsSummaryRes);

          console.log("storing sentiment...");
        } catch (error) {
          console.error("error on storing comment summaries");
          console.error(error);
        }
      }
    }
  }

  // here we are back to the top. If we have comSummary, we start
  // creating the analysis.
  if (comSummary && comSummary.length > 0) {
    sentiment = await getCommentsSentiment(token as string, params.videoid);
    console.log("sentiment breakdown: ");
    if (sentiment) {
      await PocketChain.sentimentBreakdown(sentiment);
      console.log("emotional analysis: ");
      console.log("create analysis");
    }
  }

  // once the analysis is created, we call to display here
  if (analysis && analysis.data && analysis.data.length > 0 && vidData) {
    return successDisplay(vidData);
  } else if (
    comSummary &&
    comSummary.length > 0 &&
    capSummary &&
    capSummary.data &&
    capSummary.data.length > 0
  ) {
    sentiment = await getCommentsSentiment(token as string, params.videoid);
    if (sentiment) {
      console.log("sentiment breakdown: ");
      const sentimentRes = await PocketChain.sentimentBreakdown(sentiment);
      console.log(sentimentRes);
      console.log("emotional analysis: ");
      const emoData = await getDataForEmotionalAnalysis(token, params.videoid);
      if (emoData && emoData.length > 0 && pocketChain) {
        await pocketChain.emotionalAnalysis(
          sentimentRes,
          emoData as unknown as EmotionalAnalysisArgs[]
        );
      }

      console.log("create analysis");
      return <>create analysis</>;
      //successDisplay(vidData);
    }
  } else {
    return <>no analysis yet</>;
  }
}

type MockCategories = { heading: string; description: string }[];

function successDisplay(vidData: { [x: string]: any } /** analysisData */) {
  return (
    <section className="bg-primary-content md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:flex-none flex flex-col grid-cols-none gap-0">
      <div
        id="left-side"
        className="artboard md:phone-3 sm:phone-1 bg-base-content flex flex-col justify-evenly items-center py-4"
      >
        <h1 className="text-xl text-center">{vidData && vidData.title}</h1>
        <div className="p-4 md:w-[400px] sm:w-[300px] w-[260px]">
          <Image
            src={vidData && vidData.thumbnail_url}
            alt="thumbnail"
            width={640}
            height={480}
            className="border-2 border-gray-500"
          />
        </div>
        <div className="text-ellipsis overflow-clip max-h-60 px-4">
          To summarize your YouTube video about the controversy surrounding the
          use of genetically modified organisms (GMOs), you presented arguments
          from both sides of the debate. You explained that proponents of GMOs
          argue that they can help increase crop yields, reduce the use of
          pesticides, and create crops that are more resistant to disease and
          drought. On the other hand, opponents of GMOs argue that they can have
          negative effects on human health, the environment, and biodiversity.
          You also discussed the role of corporations and government in the
          regulation of GMOs, and called for more transparency and public
          awareness about the use of these organisms in our food supply.
          Overall, your video provided a balanced and informative overview of
          this complex and controversial topic.
        </div>
      </div>

      <section className="flex flex-col justify-evenly items-center gap-12 py-12">
        <div className="md:w-full w-[280px] collapse bg-[#7AD9F8] opacity-80 text-black text-center">
          <input type="checkbox" className="w-full" />
          <div className="collapse-title text-xl font-medium">heading</div>
          <div className="collapse-content ">
            <p className="text-black">description</p>
          </div>
        </div>
      </section>

      <section className="md:-order-1 lg:order-last flex flex-col justify-evenly items-center gap-12 pb-12">
        <div className="md:w-full w-[280px] collapse bg-[#7AD9F8] opacity-80 text-black text-center">
          <input type="checkbox" className="w-full" />
          <div className="collapse-title text-xl font-medium">heading</div>
          <div className="collapse-content ">
            <p className="text-black">description</p>
          </div>
        </div>
      </section>
    </section>
  );
}
