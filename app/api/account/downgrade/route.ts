// app/api/account/downgrade/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { getStripeCustomerId } from "@/lib/supabaseClient";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId, getToken } = auth();

  if (!userId) return NextResponse.json({ url: "/sign-in" });

  // Get the auth token for Supabase
  let token = await getToken({ template: "supabase" });

  if (!token) {
    return NextResponse.json(
      { error: "error updating credits" },
      { status: 401 }
    );
  }

  // Get the Stripe customer ID from the database
  const customerId = await getStripeCustomerId(token, userId);

  if (!customerId) {
    return NextResponse.json(
      { error: "Failed to get Stripe customer id" },
      { status: 400 }
    );
  }

  // Create a session for the Stripe Customer Portal
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://pocketpr.app/Dashboard",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe session", error);
    return NextResponse.json(
      { error: "Failed to create Stripe session" },
      { status: 500 }
    );
  }
}
