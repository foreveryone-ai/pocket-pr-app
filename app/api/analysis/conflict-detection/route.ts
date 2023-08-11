import { NextResponse, NextRequest } from "next/server";
export function POST(request: NextRequest) {
  return NextResponse.json({ message: "hello from conflict detection!" });
}
