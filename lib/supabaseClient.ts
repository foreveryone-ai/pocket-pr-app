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

    //console.log("newUser: ", newUser);
    return newUser.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}

export type StoreOrUpdateParams = {
  id: string;
  video_id: string;
  title: string;
  description: string;
  published_at: string;
  thumbnail_url: string;
  channel_title: string;
  channel_id: string;
  user_id: string;
};

export async function storeOrUpdateVideo(
  authToken: string,
  video: StoreOrUpdateParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db.from("Videos").upsert(video).select();

  if (data) {
    return data;
  } else {
    return error;
  }
}
// id                  String   @id @default(cuid())
// createdAt           DateTime @default(now())
// // add update at
// comment_id          String   @unique
// text_display        String
// like_count          Int
// published_at        DateTime
// video_id            String
// video               Videos   @relation(fields: [video_id], references: [id])
// sentiment           String
// replies             Replies[]

export type StoreAllCommentsParams = {
  id: string;
  comment_id: string;
  text_display: string;
  like_count: number;
  published_at: Date;
  video_id: string;
  author_display_name: string;
  author_profile_url: string;
};

export async function storeAllComments(
  authToken: string,
  allComments: StoreAllCommentsParams
) {}
