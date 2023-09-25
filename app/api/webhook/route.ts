import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "invoice.created", // created for new or renewing subscription
  "invoice.finalized",
  "invoice.finalization_failed",
  "invoice.paid",
  "invoice.payment_action_required",
  "invoice.payment_failed",
  "invoice.updated",
  "checkout.session.completed",
  "customer.created",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = req.headers;
  const sig = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log(webhookSecret);
  let event: Stripe.Event;

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
        case "product.created":
          console.log("product was created!");
        //TODO: update db
        case "product.updated":
          console.log("product was updated!");
        //TODO: update db
        case "price.created":
        //TODO: update db
        case "price.updated":
        //TODO: update db
        case "customer.created":
          console.log("a new customer has been created!!");
        case "customer.deleted":
          console.log("a customer has been deleted!!");
        case "customer.subscription.created":
          console.log("subscription was created!!");
        //TODO: update db
        case "customer.subscription.updated":
          console.log("subscription was updated!!");
        //TODO: update db
        case "customer.subscription.deleted":
          console.log("subscription was updated!!");
        //TODO: update db
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            console.log("customer sub id: ", subscriptionId);
            //TODO: update db
          }
          break;
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
