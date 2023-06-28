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
        updatedAt: new Date(),
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
  updatedAt: Date;
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

export type StoreAllCommentsParams = {
  id: string;
  comment_id: string;
  text_display: string;
  updatedAt: Date;
  like_count: number;
  published_at: Date;
  video_id: string;
  author_display_name: string;
  author_image_url: string;
};

export async function storeAllComments(
  authToken: string,
  allComments: StoreAllCommentsParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Comments")
    .upsert(allComments)
    .select();

  if (data) {
    return data;
  } else {
    return error;
  }
}

export type StoreAllRepliesParams = {
  id: string;
  reply_id: string;
  text_display: string;
  updatedAt: Date;
  like_count: number;
  author_display_name: string;
  author_image_url: string;
  published_at: Date;
  comment_id: string;
};

export async function storeAllReplies(
  authToken: string,
  allReplies: StoreAllRepliesParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db.from("Replies").upsert(allReplies).select();

  if (data) {
    return data;
  } else {
    return error;
  }
}

export async function getComments(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Comments").select().eq(`video_id`, videoId);
}

type CommentsResponse = Awaited<ReturnType<typeof getComments>>;
export type CommentsResponseSuccess = CommentsResponse["data"];
export type CommentsResponseError = CommentsResponse["error"];

export type StoreCaptionsParams = {
  id: string;
  video_id: string;
  updatedAt: Date;
  language: string;
  text: string;
  name: string;
};

export async function storeCaptions(
  authToken: string,
  captions: StoreCaptionsParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db.from("Captions").upsert(captions).select();

  if (data) {
    return data;
  } else {
    return error;
  }
}

export async function getVideos(authToken: string, channel_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Videos").select().eq(`channel_id`, channel_id);
}
