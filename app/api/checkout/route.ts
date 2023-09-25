import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  let session;

  const user = await currentUser();
  // redirect on front end
  if (!user) return NextResponse.json({ url: "/sign-in" });

  // stripe will automagically create a new customer
  // create checkout session
  try {
    console.log("creating new session...");
    session = await stripe.checkout.sessions.create({
      //   payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1Nu7GBHlKxOqEafNNmvsy6d8",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true, // hmm ....
      subscription_data: {
        metadata: {}, // what does here?
      },
      success_url: `http://localhost:3000/Dashboard`,
      cancel_url: `http://localhost:3000/Dashboard`,
    });
    console.log(`Session: ${session}  SessionId: ${session?.id}`);
    console.log(`Session: url??: ${session.url}`);
    return new Response(
      JSON.stringify({ sessionId: session?.id, sessionUrl: session.url }),
      {
        status: 200,
      }
    );
  } catch (error) {
    throw new Error("unable to create session");
  }
}
