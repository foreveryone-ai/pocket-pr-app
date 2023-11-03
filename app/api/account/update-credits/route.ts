import { getNextBillingStartDate } from "@/helpers/dateHelpers";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserById, decrementUserCredits } from "@/lib/supabaseClient";

export async function POST() {
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });
  let nextStart: string;

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
    const userData = await getUserById(token, userId, [
      "credits",
      "updateCreditDate",
    ]);
    if (!userData) {
      throw new Error("error on getting credits");
    }
    console.log("userData: ", userData);
    // @ts-ignore
    if (userData && userData.credits && userData.updateCreditDate) {
      // @ts-ignore
      nextStart = new Date(userData.updateCreditDate).toLocaleDateString();
      return NextResponse.json(
        {
          message:
            // @ts-ignore
            `You have ${userData.credits} left. Next credits available on ` +
            (nextStart ?? ""),
        },
        { status: 200 }
      );
    } else {
      // @ts-ignore
      nextStart = new Date(userData.updateCreditDate).toLocaleDateString();
      return NextResponse.json(
        {
          error:
            // @ts-ignore
            `You have ${userData.credits} credits left. Next credits available on ` +
            (nextStart ?? ""),
        },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("error getting currentUser info", error);
    return null;
  }
}

// const startDate = getNextBillingStartDate(new Date(data[0].createdAt));
// return NextResponse.json({
//   message: `Analyzed video, you have ${data[0].credits} remaining. Credits will renew on ${startDate}`,
// });
