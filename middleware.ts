import { authMiddleware } from "@clerk/nextjs";
import { NextMiddleware, NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/help",
    "/sign-in",
    "/sign-up",
    "/api/webhook",
    "/privacy",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
