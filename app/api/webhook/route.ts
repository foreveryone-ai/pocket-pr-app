import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const relevantEvents = new Set([
  "customer.created",
  "invoice.payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = req.headers;
  const sig = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;
  let paid = false;
  let customerId = "";
  let status = "";

  try {
    if (!sig || !webhookSecret) return;
    console.log("have sig and webhhook secret....");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          console.log("Payment intent succeeded");
          paid = true;
          // @ts-ignore
          customerId = event.data.object.customer as string;
          // @ts-ignore
          status = event.data.object.status as string;
          console.log(paid, customerId, status);
        case "customer.created":
          console.log("a new customer has been created!!");
        case "customer.subscription.created":
          console.log("subscription was created!!");
          console.log(event.data.object);
          paid = true;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            console.log("customer sub id: ", subscriptionId);
          }
        case "customer.subscription.deleted": // this is what happens when they cancel
          paid = false;
          console.log("subscription was updated!!");
          console.log(event.data.object);
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      );
    }
  }
  return new Response(JSON.stringify({ received: true }));
}
