import AnalysisButton from "@/app/components/AnalysisButton";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCaptionSummary, getVideo } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";
import { getOAuthData } from "@/lib/googleApi";
import VideoCommentsCaptionsButton from "@/app/components/VideoCommentsCaptionsButton";

type VideoCardProps = {
  key: number;
  videoId: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
};

export default function ChatUI({
  key,
  title,
  imageUrl,
  videoId,
}: VideoCardProps) {
  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };
  return (
    <div
      className="flex items-center justify-center min-h-screen pt-18 bg-green-800"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 text-center border-b border-gray-200 text-black font-semibold">
            New Chat
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "500px" }}>
            <div className="chat chat-start">
              <div className="chat-bubble">
                It's over Anakin, <br />I have the high ground.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">You underestimate my power!</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">Don't try it.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">I hate you!</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                You were my brother, Anakin. <br />I loved you.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">I HATE YOU!</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                Anakin... Chancellor Palpatine is evil!
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                From my point of view, the Jedi are evil!
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">Well then you are lost!</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                The dark side is the only way to save Padmé!
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                Anakin, Padmé would never want this for you.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                You don't know what she wants for me!
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                I know you're a good person, Anakin. Don't let Palpatine control
                you.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                Palpatine is the only one who understands my power!
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                Your power doesn't have to be used for evil.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                It's the Jedi who are evil! They've held me back my entire life!
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type here"
              className="input w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
