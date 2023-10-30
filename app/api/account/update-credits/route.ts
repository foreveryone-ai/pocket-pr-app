import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { CreditAction, updateUserCredits } from "@/lib/supabaseClient";

export async function POST() {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!token) {
    return NextResponse.json(
      { error: "error updating credits" },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "error updating credits" },
      { status: 401 }
    );
  }
  // call supabase
  try {
    const { data, error } = await updateUserCredits(
      userId,
      token,
      CreditAction.Subtract,
      1
    );
  } catch (error) {
    throw new Error("ahh!");
  }
}
