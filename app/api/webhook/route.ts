import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const relevantEvents = new Set([
  "customer.deleted",
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
  let subscriptionActive = false;
  let customerId: string;
  let userId: string;

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);

  const client = createClient(url, supabaseKey);

  try {
    if (!sig || !webhookSecret) {
      return new Response(`Webhook Error`, { status: 401 });
    }
    console.log("have sig and webhhook secret....");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded": // this might be good enough, maybe don't need sub.created
          console.log("Payment intent succeeded"); // works on sub created
          subscriptionActive = true; // works on monthly bill
          // @ts-ignore
          customerId = event.data.object.customer as string;
          //updatedb
          if (customerId) {
            try {
              const { data: stripeData, error: stripeError } = await client
                .from("Stripe")
                .update({
                  subscription_active: subscriptionActive,
                })
                .eq("id", customerId)
                .select();
              if (stripeData) {
                console.log(stripeData);
              }
              if (stripeError) {
                console.error(stripeError);
              }
            } catch (error) {
              throw new Error(
                "unable to update subscription upon successful payment"
              );
            }
          }
          console.log(
            `latest update of variables:\ncustomerId: ${customerId},\nsubActive: ${subscriptionActive}`
          );
          break;
        case "customer.subscription.created":
          console.log("subscription was created!!");
          console.log(event.data.object);
          // @ts-ignore
          customerId = event.data.object.customer as string;
          // @ts-ignore
          userId = event.data.object.metadata.userId;
          subscriptionActive = true;
          console.log("customerId: ", userId);
          if (userId) {
            try {
              const { data: stripeData, error: stripeError } = await client
                .from("Stripe")
                .insert({
                  id: customerId,
                  user_id: userId,
                  subscription_active: subscriptionActive,
                })
                .eq("id", userId)
                .select();
              if (stripeData) {
                console.log(stripeData);
              }
              if (stripeError) {
                console.error(stripeError);
              }
            } catch (error) {
              throw new Error("unable to create new stripe user in db");
            }
          }
          console.log(
            `latest update of variables:\ncustomerId: ${customerId},\nsubActive: ${subscriptionActive}`
          );
          break;
        case "customer.subscription.updated":
          console.log("subscription was updated");
          console.log(event.data.object);
          // @ts-ignore
          console.log(event.data.object.cancel_at);
          // @ts-ignore
          const cancel = event.data.object.cancel_at ? true : null;
          if (cancel) {
            console.log("cancelling subscription");
            // @ts-ignore
            customerId = event.data.object.customer as string;
            if (customerId) {
              try {
                // @ts-ignore
                const timestamp = event.data.object.cancel_at * 1000;
                const { data: stripeData, error: stripeError } = await client
                  .from("Stripe")
                  .update({
                    cancel_at: new Date(timestamp),
                  })
                  .eq("id", customerId)
                  .select();
                if (stripeData) {
                  console.log(stripeData);
                }
                if (stripeError) {
                  console.error(stripeError);
                }
              } catch (error) {
                throw new Error("unable to update user after user was deleted");
              }
            }
          } else {
            console.log("renewing subscription");
            subscriptionActive = true;
            // @ts-ignore
            customerId = event.data.object.customer as string;
            if (customerId) {
              try {
                const { data: stripeData, error: stripeError } = await client
                  .from("Stripe")
                  .update({
                    subscription_active: subscriptionActive,
                    cancel_at: null,
                  })
                  .eq("id", customerId)
                  .select();
                if (stripeData) {
                  console.log(stripeData);
                }
                if (stripeError) {
                  console.error(stripeError);
                }
              } catch (error) {
                throw new Error("unable to update user after they renewed");
              }
            }
          }
          break;
        case "customer.subscription.deleted": // this is what happens when they cancel
          subscriptionActive = false;
          console.log("subscription was deleted!!");
          // @ts-ignore
          customerId = event.data.object.customer as string;
          if (customerId) {
            try {
              const { data: stripeData, error: stripeError } = await client
                .from("Stripe")
                .update({
                  subscription_active: subscriptionActive,
                })
                .eq("id", customerId)
                .select();
              if (stripeData) {
                console.log(stripeData);
              }
              if (stripeError) {
                console.error(stripeError);
              }
            } catch (error) {
              throw new Error(
                "unable to update sub status upon sub cancellation"
              );
            }
          }
          console.log(event.data.object);
          console.log(
            `latest update of variables:\ncustomerId: ${customerId},\nsubActive: ${subscriptionActive}`
          );
          break;
        case "customer.deleted": // this is what happens when they cancel
          subscriptionActive = false;
          //TODO: get customerID
          console.log("customer was deleted!!");
          // @ts-ignore
          customerId = event.data.object.id as string;
          if (customerId) {
            try {
              const { data: stripeData, error: stripeError } = await client
                .from("Stripe")
                .update({
                  subscription_active: subscriptionActive,
                })
                .eq("id", customerId)
                .select();
              if (stripeData) {
                console.log(stripeData);
              }
              if (stripeError) {
                console.error(stripeError);
              }
            } catch (error) {
              throw new Error("unable to update user after user was deleted");
            }
          }
          console.log(
            `latest update of variables:\ncustomerId: ${customerId},\nsubActive: ${subscriptionActive}`
          );
          break;
        default:
          console.log(`unhandled event: ${event.data.object}`);
          return new Response(JSON.stringify({ received: true }));
      }
      return new Response(JSON.stringify({ received: true }));
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
