import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  //check for stripe account in DB?
  // or
  // create new user in stripe?

  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "ForEveryone.ai partners with Stripe for simplified billing.",
    },
    features: {
      invoice_history: {
        enabled: true,
      },
    },
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: "cus_OhmsYR5io1xIgS", // test customer
    return_url: process.env.LOCAL_DOMAIN + "Dashboard",
  });

  if (session) {
    return NextResponse.json({ url: session.url });
  }
}
