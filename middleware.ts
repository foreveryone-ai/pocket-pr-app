import { authMiddleware } from "@clerk/nextjs";
import { NextMiddleware, NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/help",
    "/sign-in",
    "/sign-up",
    "/privacy, /api/webhook",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
