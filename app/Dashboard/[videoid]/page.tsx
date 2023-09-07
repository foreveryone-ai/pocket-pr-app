import { NextResponse } from "next/server";
import ChatUI from "@/app/components/ChatUI";
// import AnalysisButton from "@/app/components/AnalysisButton";
// import { redirect } from "next/navigation";
// import Image from "next/image";
import { getCaptionSummary } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";
import { useState } from "react";
// import { getOAuthData } from "@/lib/googleApi";
// import VideoCommentsCaptionsButton from "@/app/components/VideoCommentsCaptionsButton";

// type VideoCardProps = {
//   key: number;
//   videoId: string;
//   title: string;
//   imageUrl: string;
//   width: number;
//   height: number;
// };
export default async function ChatPage({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  console.log(userId);
  const token = await getToken({ template: "supabase" });

  let captions;

  if (!token) return NextResponse.rewrite("/sign-in");
  // get captions summary to send to
  const { data: captionsData, error: captionsError } = await getCaptionSummary(
    token,
    params.videoid
  );

  if (captionsError) {
    console.error(captionsError);
    return NextResponse.json({ message: "Error on chat" });
  }
  if (captionsData && captionsData.length > 0) {
    captions = captionsData[0].summaryText;
  }

  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return <ChatUI videoid={params.videoid} captionsSummary={captions} />;
}

// export default function ChatPage({
//   key,
//   title,
//   imageUrl,
//   videoId,
// }: VideoCardProps) {
//   const truncateTitle = (title: string, limit: number = 10) => {
//     return title.length > limit ? `${title.substring(0, limit)}...` : title;
//   };
//   return (
//     <ChatUI />
//   )
// }

// export default async function Video({
//   params,
// }: {
//   params: { videoid: string };
// }) {
//   const { userId, getToken } = auth();
//   // token used for all supabase calls
//   const token = await getToken({ template: "supabase" });
//   console.log("got token...");
//   // global variables
//   let userOAuth, summary;

//   // we get oauth from google so long as we have Clerk userId
//   if (userId) {
//     try {
//       userOAuth = await getOAuthData(userId, "oauth_google");
//     } catch (error) {
//       console.error("no oauth found ", error);
//     }
//   }

//   // if supabase token has expired, redirect to /sign-in
//   if (!token) {
//     console.log("no token found, redirect to /sign-in");
//     redirect("/sign-in");
//   }

//   // get video data for the current video
//   const vidData = await getVideo(token as string, params.videoid as string);

//   // get caption summary and save to summary if it exists
//   const { data: summaryData, error: summaryError } = await getCaptionSummary(
//     token,
//     "",
//     params.videoid
//   );
//   if (summaryData && summaryData.length > 0) {
//     summary = summaryData[0].summaryText;
//   }
//   if (summaryError) {
//     console.error(summaryError);
//   }

//   const analysisTitles = [
//     "Sentiment",
//     "Emotions",
//     "Conflict",
//     "Resolution",
//     "Popular",
//     "Suggestions",
//     "Engagement",
//     "Notable",
//     "Influencer",
//     "Tone",
//   ];

//   return (
//     <section className="bg-primary-content md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:flex-none flex flex-col grid-cols-none gap-0">
//       <div
//         id="left-side"
//         className="artboard md:phone-3 sm:phone-1 bg-base-content flex flex-col justify-evenly items-center py-4"
//       >
//         <h1 className="text-xl text-center">{vidData && vidData[0].title}</h1>
//         <div className="p-4 md:w-[400px] sm:w-[300px] w-[260px]">
//           <Image
//             src={vidData && vidData[0].thumbnail_url}
//             alt="thumbnail"
//             width={640}
//             height={480}
//             className="border-2 border-gray-500"
//           />
//         </div>
//         <div className="text-ellipsis overflow-clip max-h-60 px-4">
//           {summary ? (
//             summary
//           ) : (
//             <VideoCommentsCaptionsButton
//               videoId={params.videoid}
//               source={"video"}
//             />
//           )}
//         </div>
//         {summaryData ? (
//           <ChatUI videoid={params.videoid} captionSummary={summary} />
//         ) : (
//           <p className="text-red-400">problem with caption summary</p>
//         )}
//       </div>

//       <section className="flex flex-col justify-evenly items-center gap-12 py-12">
//         <AnalysisButton title={analysisTitles[0]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[1]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[2]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[3]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[4]} videoid={params.videoid} />
//       </section>

//       <section className="md:-order-1 lg:order-last flex flex-col justify-evenly items-center gap-12 pb-12">
//         <AnalysisButton title={analysisTitles[5]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[6]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[7]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[8]} videoid={params.videoid} />
//         <AnalysisButton title={analysisTitles[9]} videoid={params.videoid} />
//       </section>
//     </section>
//   );
// }
