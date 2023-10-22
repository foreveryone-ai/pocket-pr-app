import { NextResponse } from "next/server";
import ChannelChatUI from "@/app/components/ChannelChatUI";
import { auth, currentUser } from "@clerk/nextjs";
import NavBar from "../../components/NavBar";

export default async function ChannelChatPage({
  params,
}: {
  params: { channelid: string };
}) {
  const { userId, getToken } = auth();
  const token = await getToken({ template: "supabase" });

  if (!token) return NextResponse.rewrite("/sign-in");

  // Get the current user's name
  const user = await currentUser();
  const userName = user?.firstName;

  return (
    <div className="min-h-screen bg-green-800">
      <NavBar />
      <ChannelChatUI channelid={params.channelid} userName={userName} />
    </div>
  );
}
