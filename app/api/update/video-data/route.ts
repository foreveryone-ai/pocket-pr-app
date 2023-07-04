import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "yay! from update/video-data" });
}
