import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    videoid: string;
  };
};

export function POST(req: NextRequest, context: Params) {
  const videoid = context.params.videoid;
  console.log("videoid: ", videoid);
  return NextResponse.json({ message: "Hello from chat!" });
}
