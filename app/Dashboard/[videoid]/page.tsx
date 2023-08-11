import AnalysisButton from "@/app/components/AnalysisButton";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getVideo } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";
import { getOAuthData } from "@/lib/googleApi";

//TODO: will need an update button if captions or comments are not in db

export default async function Video({
  params,
}: {
  params: { videoid: string };
}) {
  const { userId, getToken } = auth();
  // token used for all supabase calls
  const token = await getToken({ template: "supabase" });
  console.log("got token...");
  // global variables
  let userOAuth;

  // we get oauth from google so long as we have Clerk userId
  if (userId) {
    try {
      userOAuth = await getOAuthData(userId, "oauth_google");
    } catch (error) {
      console.error("no oauth found ", error);
    }
  }

  // if supabase token has expired, redirect to /sign-in
  if (!token) {
    console.log("no token found, redirect to /sign-in");
    redirect("/sign-in");
  }

  const vidData = await getVideo(token as string, params.videoid as string);

  const analysisTitles = [
    "Sentiment",
    "Emotions",
    "Conflict",
    "Resolution",
    "Popular",
    "Suggestions",
    "Engagement",
    "Notable",
    "Influencer",
    "Tone",
  ];

  return (
    <section className="bg-primary-content md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:flex-none flex flex-col grid-cols-none gap-0">
      <div
        id="left-side"
        className="artboard md:phone-3 sm:phone-1 bg-base-content flex flex-col justify-evenly items-center py-4"
      >
        <h1 className="text-xl text-center">{vidData && vidData[0].title}</h1>
        <div className="p-4 md:w-[400px] sm:w-[300px] w-[260px]">
          <Image
            src={vidData && vidData[0].thumbnail_url}
            alt="thumbnail"
            width={640}
            height={480}
            className="border-2 border-gray-500"
          />
        </div>
        <div className="text-ellipsis overflow-clip max-h-60 px-4">
          {/* feed in captions here */}
        </div>
      </div>

      <section className="flex flex-col justify-evenly items-center gap-12 py-12">
        <AnalysisButton title={analysisTitles[0]} />
        <AnalysisButton title={analysisTitles[1]} />
        <AnalysisButton title={analysisTitles[2]} />
        <AnalysisButton title={analysisTitles[3]} />
        <AnalysisButton title={analysisTitles[4]} />
      </section>

      <section className="md:-order-1 lg:order-last flex flex-col justify-evenly items-center gap-12 pb-12">
        <AnalysisButton title={analysisTitles[5]} />
        <AnalysisButton title={analysisTitles[6]} />
        <AnalysisButton title={analysisTitles[7]} />
        <AnalysisButton title={analysisTitles[8]} />
        <AnalysisButton title={analysisTitles[9]} />
      </section>
    </section>
  );
}
