import { getNextBillingStartDate } from "@/helpers/dateHelpers";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserById, decrementUserCredits } from "@/lib/supabaseClient";

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
    await decrementUserCredits(userId, token);
  } catch (error) {
    console.error(error);
  }
  try {
    const { data: userData, error: userError } = await getUserById(
      token,
      userId,
      ["credits", "createdAt"]
    );
    if (userError) {
      throw new Error("error on getting credits" + userError);
    }
    if (
      userData &&
      userData[0] &&
      userData[0].createdAt &&
      userData[0].length > 0
    ) {
      const nextStart = getNextBillingStartDate(
        new Date(userData[0].createdAt)
      );
    }
    return NextResponse.json(
      {
        error: "no available credits, next credits available on " + nextStart,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("error getting currentUser info", error);
    return null;
  }
}

if (data && data.length > 0) {
  console.log(data);
  console.log(data[0]);
  console.log(data[0].createdAt);
  const startDate = getNextBillingStartDate(new Date(data[0].createdAt));
  return NextResponse.json({
    message: `Analyzed video, you have ${data[0].credits} remaining. Credits will renew on ${startDate}`,
  });
}
