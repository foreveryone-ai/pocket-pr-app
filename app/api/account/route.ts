import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getStripeId } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs";

export async function GET() {
  //TODO: give user feedback id they haven't signed up for a subscription yet
  // TODO: OR make it so they can't see the button in the first place
  const { userId, getToken } = auth();
  let token = await getToken({ template: "supabase" });

  if (!userId) {
    return NextResponse.json({ error: "error loading dashboard" });
  }

  try {
    const { data: stripeData, error: stripeError } = await getStripeId(
      token as string,
      userId as string
    );

    if (stripeError) {
      throw new Error("could not get stripe id");
    }
    if (stripeData && stripeData.length > 0) {
      const configuration = await stripe.billingPortal.configurations.create({
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

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeData[0].id as unknown as string, // customer id returned from db
        return_url: process.env.LOCAL_DOMAIN + "Dashboard",
      });

      if (session) {
        return NextResponse.json({ url: session.url });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
