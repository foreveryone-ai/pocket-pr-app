import getStripe from "@/lib/stripe";

export default async function POST(req: Request) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("stripe fail");
  }

  const mockHobbyiest = {
    price_data: {
      currency: "usd",
      product_data: {
        name: "hobbyist",
      },
      unit_amount: Math.floor(9 * 100),
    },
    quantity: 1,
  };
  const session = await stripe.checkout.sessions.create({
    line_items: orderItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancellation",
  });

  return NextResponse.json({ url: session.url });
}
