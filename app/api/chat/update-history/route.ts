import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId, getToken } = auth();
  const userData = await req.json();

  console.log("user data: ", userData);

  const token = await getToken({ template: "supabase" });
  // send to sign-in if there is no token
  if (!token) return NextResponse.rewrite("/sign-in");
  if (!userId) return NextResponse.rewrite("/sign-in");

  // if
}
