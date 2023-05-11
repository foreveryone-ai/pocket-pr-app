import { auth, currentUser } from "@clerk/nextjs";
import { google } from "googleapis";

async function getOAuthData(userId: string, provider: string) {
  const res = await fetch(
    `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/${provider}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();
  let userOAuth, yt, chList;

  if (userId) {
    userOAuth = await getOAuthData(userId, "oauth_google");

    console.log(userOAuth[0].token);

    yt = google.youtube({
      version: "v3",
      headers: {
        Authorization: `Bearer ${userOAuth[0].token}`,
      },
    });
  }
  if (yt) {
    chList = await yt.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
      maxResults: 5,
    });
  }

  console.log("userOAuth: ", userOAuth);
  console.log("all channels: ", chList?.data.items);

  console.log(
    "all channel Ids: ",
    chList?.data.items?.map((item) => item.id)
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {user?.firstName}. Welcome to <b>PocketPR</b>. Your user ID is{" "}
        {userId}.
      </div>
    </main>
  );
}
