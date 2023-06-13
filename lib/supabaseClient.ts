import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export function createServerDbClient(accessToken?: string) {
  return createClient(supabaseUrl as string, supabaseKey as string, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function createUser(
  authToken: string,
  userId: string,
  googleId: string,
  name: string,
  email: string,
  imageUrl: string,
  youtubeChannelId: string
) {
  try {
    // auth token is here ...
    const db = createServerDbClient(authToken);

    const newUser = await db
      .from("Users")
      .upsert({
        id: userId,
        google_id: googleId,
        name,
        email,
        image_url: imageUrl,
        youtube_channel_id: youtubeChannelId,
      })
      .select();

    console.log("newUser: ", newUser);
    return newUser.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}

export async function storeOrUpdateVideo(
  authToken: string,
  video_id: string,
  title: string,
  published_at: string,
  thumbnail_url: string,
  channel_id: string,
  user_id: string
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Videos")
    .upsert({
      video_id,
      title,
      published_at,
      thumbnail_url,
      channel_id,
      user_id,
    })
    .select();

  if (data) {
    return data;
  } else {
    return error;
  }
}
