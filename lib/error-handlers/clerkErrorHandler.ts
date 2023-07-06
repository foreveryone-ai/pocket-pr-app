import { auth } from "@clerk/nextjs";
export default class ClerkErrorHandler {
  static async missingRefreshToken() {
    console.log("Handling missing refresh token error...");
    const { userId, sessionId } = auth();
    fetch(`https://api.clerk.com/v1/sessions/${sessionId}/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY as string}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("User logged out due to expired google token");
        } else {
          throw new Error("Error logging out user");
        }
      })
      .catch((error) => {
        console.error("Error logging out user:", error);
      });
  }
}
