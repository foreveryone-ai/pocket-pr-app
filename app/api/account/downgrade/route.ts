import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { customerId } = req.body;
    if (!customerId) {
      res.status(400).json({ error: "Missing customer id" });
      return;
    }

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: "https://pocketpr.app/Dashboard",
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: "Failed to create Stripe session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
