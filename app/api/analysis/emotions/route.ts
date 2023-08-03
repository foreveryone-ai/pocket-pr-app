import { NextResponse } from "next/server";
export function POST(request: Request) {
  return NextResponse.json({ message: "emotions route" });
}
