import { NextResponse, NextRequest } from "next/server";
export function GET(request: NextRequest) {
  // think about settin up a call to another api route to take care of some boilerplate stuff
  return NextResponse.json({ message: "hello from conflict detection!" });
}
