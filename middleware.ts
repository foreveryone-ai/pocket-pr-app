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
    "/api/cron-jobs/yt-update-pro",
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
