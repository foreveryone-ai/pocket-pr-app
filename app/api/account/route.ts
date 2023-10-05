import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getStripeId } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";

export async function POST() {
  //TODO: give user feedback id they haven't signed up for a subscription yet
  // TODO: OR make it so they can't see the button in the first place
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });
  let session;

  if (!userId) {
    return NextResponse.json(
      { error: "error loading dashboard" },
      { status: 401 }
    );
  }

  try {
    const { data: stripeData, error: stripeError } = await getStripeId(
      token as string,
      userId as string
    );

    if (stripeError) {
      console.error("error getting stripe info from db");
      return NextResponse.json({ error: "server error" }, { status: 500 });
    }
    if (stripeData && stripeData.length > 0) {
      try {
        await stripe.billingPortal.configurations.create({
          business_profile: {
            headline:
              "ForEveryone.ai partners with Stripe for simplified billing.",
          },
          features: {
            invoice_history: {
              enabled: true,
            },
          },
        });
      } catch (error) {
        console.error("error creating dashboard config");
        return NextResponse.json({ error: "server error" }, { status: 500 });
      }

      try {
        session = await stripe.billingPortal.sessions.create({
          customer: stripeData[0].id as unknown as string, // customer id returned from db
          return_url: process.env.LOCAL_DOMAIN + "Dashboard",
        });
      } catch (error) {
        console.error("problem creating the session", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
      }

      if (session) {
        return NextResponse.json({ url: session.url }, { status: 200 });
      }
      console.error("this should not happen");
      return NextResponse.json({ error: "server error" }, { status: 500 });
    }
    return NextResponse.json(
      { error: "User does not have a Stripe account" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
