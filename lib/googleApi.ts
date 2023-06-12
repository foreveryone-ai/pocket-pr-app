import { google } from "googleapis";

async function getOAuthData(userId: string, provider: string) {
  const res = await fetch(
    `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/${provider}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

export { google, getOAuthData };
