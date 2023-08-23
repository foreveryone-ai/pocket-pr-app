import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    videoid: string;
  };
};

export async function POST(req: NextRequest, context: Params) {
  const videoid = context.params.videoid;
  console.log(await req.json());
  // check if vector store exists
  // return isStore true
  return NextResponse.json({ message: "Hello from chat..." });
  // if it doesn't, check
}
