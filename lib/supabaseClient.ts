import { SubscriptionStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

function createServerDbClient(accessToken?: string) {
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
//-------------------------------Create------------------------------------//
export async function createStripeUser(
  authToken: string,
  userId: string,
  subscriptionActive: boolean,
  plan?: string
) {
  try {
    // auth token is here ...
    const db = createServerDbClient(authToken);

    const stripeUser = await db
      .from("stripe")
      .insert({
        user_id: userId,
        supscription_active: subscriptionActive,
        plan: plan || null,
      })
      .select();

    console.log("new stripe user!: ", stripeUser);
    return stripeUser.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}
export async function createUser(
  authToken: string,
  userId: string,
  googleId: string,
  name: string,
  email: string,
  imageUrl: string
  //  channel_id: string
) {
  try {
    // auth token is here ...
    const db = createServerDbClient(authToken);

    const newUser = await db
      .from("User")
      .upsert({
        id: userId,
        google_id: googleId,
        updatedAt: new Date(),
        name,
        email,
        image_url: imageUrl,
        subscriptionStatus: SubscriptionStatus.NONE,
        //       channel_id,
      })
      .select();

    console.log("newUser: ", newUser);
    return newUser.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}

export async function storeChannelId(
  authToken: string,
  user_id: string,
  youtube_channel_id: string,
  channel_id: string
) {
  try {
    // auth token is here ...
    const db = createServerDbClient(authToken);

    const updatedUser = await db
      .from("User")
      .update({
        channel_id,
        youtube_channel_id,
        updatedAt: new Date(),
      })
      .match({ id: user_id })
      .select();

    console.log("updated user: ", updatedUser);
    return updatedUser.status; // 201
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

  const { data, error } = await db.from("Video").upsert(video).select();

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

//-------------------------------Get Latest Video Date------------------------------------//

export async function getLatestVideoDate(
  authToken: string,
  user_id: string
): Promise<Date | null> {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Video")
    .select("published_at")
    .eq("user_id", user_id)
    .order("published_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return null;
  }

  if (data && data.length > 0) {
    const latestVideoDate = new Date(data[0].published_at);
    console.log("Latest video date:", latestVideoDate);
    return latestVideoDate;
  } else {
    return null;
  }
}

//-------------------------------Read------------------------------------//

export async function getStripeId(authToken: string, userId: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Stripe").select().eq("user_id", userId);
}

export async function getCaptionSummary(
  authToken: string,
  caption_id: string,
  video_id?: string,
  channel_id?: string
) {
  const db = createServerDbClient(authToken);
  if (video_id) {
    return await db.from("CaptionSummary").select().eq(`video_id`, video_id);
  }
  return await db.from("CaptionSummary").select().eq(`caption_id`, caption_id);
}

//-------------------------------Update------------------------------------//
export async function updateStripeUserSubscriptionStatus(
  authToken: string,
  subscriptionActive: boolean,
  userId: string
) {
  const db = createServerDbClient(authToken);

  return await db
    .from("stripe")
    .update({
      subscription_active: subscriptionActive,
    })
    .eq("user_id", userId)
    .select();
}

export async function updateVideoHasEmbeddings(
  authToken: string,
  video_id: string,
  bool: boolean
) {
  const db = createServerDbClient(authToken);

  return await db
    .from("Video")
    .update({ hasEmbeddings: bool })
    .eq("id", video_id)
    .select();
}

export async function storeAllComments(
  authToken: string,
  allComments: StoreAllCommentsParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Comments")
    .upsert(allComments)
    .select();
  console.log("Storing comments to database:", data, error); // Add this line

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
  console.log("Storing replies to database:", data, error); // Add this line

  if (data) {
    return data;
  } else {
    return error;
  }
}

export async function getComments(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  const result = await db.from("Comments").select().eq(`video_id`, videoId);

  console.log("Fetched comments from database:", result); // Add this line

  return result;
}

export async function getCaptions(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  return await db
    .from("Captions")
    .select("*, channel_id")
    .eq(`video_id`, videoId);
}

type CommentsResponse = Awaited<ReturnType<typeof getComments>>;
export type CommentsResponseSuccess = CommentsResponse["data"];
export type CommentsResponseError = CommentsResponse["error"];

export type StoreCaptionsParams = {
  id: string;
  video_id: string;
  captions: string;
  updatedAt: Date;
  language: string;
  channel_id: string;
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

export async function getChannelId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("User").select().eq(`id`, user_id);
}

export async function getVideo(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);
  const res = await db.from("Video").select().eq("id", videoId);
  if (res && res.data && res.data.length > 0) {
    return res.data;
  } else {
    console.error(res.error);
    return;
  }
}

export async function getVideos(authToken: string, channel_id: string) {
  const db = createServerDbClient(authToken);

  return await db
    .from("Video")
    .select()
    .eq(`channel_id`, channel_id)
    .order("published_at", { ascending: false });
}

export async function getVideosByUserId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Video").select().eq(`user_id`, user_id);
}

export type StoreCommentSummaryParams = {
  id: string; // in this case, commentId
  sentiment: string;
  summary: string;
};

export async function storeCaptionsSummary(
  authToken: string,
  caption_id: string,
  summaryText: string,
  video_id: string,
  channel_id: string
) {
  const db = createServerDbClient(authToken);
  // default values are not being generated by prisma
  const { data, error } = await db
    .from("CaptionSummary")
    .insert({
      id: uuidv4(),
      updatedAt: new Date(),
      summaryText,
      caption_id,
      video_id,
      channel_id,
    })
    .select();

  if (data) {
    console.log("returning data from storeCaptionsSummary");
    return data;
  } else {
    console.error("error on storeCaptionsSummary");
    console.error(error);
    return error;
  }
}

// lib/supabaseClient.ts

export async function getCaptionSummaries(
  authToken: string,
  channel_id: string
) {
  const db = createServerDbClient(authToken);

  return await db.from("CaptionSummary").select().eq(`channel_id`, channel_id);
}

// store and retrieve the AllCaptionSummary
export async function storeAllCaptionSummary(
  authToken: string,
  allCaptionsSummary: string,
  channel_id: string
) {
  try {
    const db = createServerDbClient(authToken);

    const updatedSummary = await db
      .from("AllCaptionSummary")
      .upsert({
        channel_id,
        all_captions_summary: allCaptionsSummary,
        updated_at: new Date(), // Set updated_at to the current date and time
      })
      .select();

    console.log("updated summary: ", updatedSummary);
    return updatedSummary.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}

export async function getAllCaptionSummary(
  authToken: string,
  channel_id: string
): Promise<{ data: any; error: any }> {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("AllCaptionSummary")
    .select("body")
    .eq("channel_id", channel_id);

  if (data) {
    return { data, error: null };
  } else {
    console.error("Error retrieving AllCaptionSummary:", error);
    return { data: null, error };
  }
}

export async function getChannelIdByUserId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);
  const { data, error } = await db
    .from("User")
    .select("channel_id")
    .eq("id", user_id);
  if (error) {
    console.error(error);
    return null;
  }
  return data[0]?.channel_id;
}

// Stage A Pre-Processing -- Draft 1 -- 2021-07-21

export type Comment = {
  comment_id: string;
  text_display: string;
  like_count: number;
  author_display_name: string;
  channel_id: string;
  video_id: string;
};

export type SmallComment = Pick<
  Comment,
  | "comment_id"
  | "text_display"
  | "like_count"
  | "author_display_name"
  | "channel_id"
  | "video_id"
>;

// TODO: add a type for the batches
// This class has methods to preprocess an array of comment objects. The preprocessComments method takes an optional minChars parameter, filters the comments by length, creates batches of comments, and returns and array of SmallComment objects. The SmallComment objects are created by mapping the Comment objects to a smaller set of properties.
export class PreProcessorA {
  comments: Comment[];
  smallComments: SmallComment[];
  batchSize: number;

  constructor(comments: Comment[], batchSize = 10) {
    this.comments = comments;
    this.smallComments = [];
    this.batchSize = batchSize;
  }

  createSmallCommentsArray() {
    this.smallComments = this.comments.map(
      ({
        comment_id,
        text_display,
        like_count,
        author_display_name,
        channel_id,
        video_id,
      }) => ({
        comment_id,
        text_display,
        like_count,
        author_display_name,
        channel_id,
        video_id,
      })
    );
    console.log("smallComments updated...");
    console.log(this.smallComments);
  }

  filterCommentsByLength(minChars: number) {
    this.smallComments = this.smallComments.filter(
      (comment) => comment.text_display.length >= minChars
    );
    console.log("comments filtered by length...");
    console.log(this.smallComments);
  }

  createBatches(): SmallComment[][] {
    console.log("created batches...");
    const batches = [];
    for (let i = 0; i < this.smallComments.length; i += this.batchSize) {
      const batch = this.smallComments.slice(
        i,
        i + Math.min(this.batchSize, this.smallComments.length)
      );
      batches.push(batch);
    }
    console.log("batches has a length of ", batches.length);
    console.log(batches);
    return batches;
  }

  preprocessComments(minChars = 3): SmallComment[][] {
    console.log("preprocessComments...");
    this.createSmallCommentsArray();
    this.filterCommentsByLength(minChars);
    return this.createBatches();
  }
}

//-------------------------------Delete------------------------------------//

//-------------------------------Update 'Agreed' Bool (does user agree to have their chat history utilized for training)------------------------------------//

export async function getUserAgreed(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);
  const { data, error } = await db
    .from("User")
    .select("agreed")
    .eq("id", user_id);
  if (error) {
    console.error(error);
    return null;
  }
  return data[0]?.agreed;
}

export async function updateUserAgreed(
  authToken: string,
  user_id: string,
  agreed: boolean
) {
  const db = createServerDbClient(authToken);
  const { data, error } = await db
    .from("User")
    .update({ agreed })
    .eq("id", user_id);
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function getChannelIdByVideoId(
  authToken: string,
  video_id: string
) {
  const db = createServerDbClient(authToken);
  const { data, error } = await db
    .from("Video")
    .select("channel_id")
    .eq("id", video_id);
  if (error) {
    console.error(error);
    return null;
  }
  return data[0]?.channel_id;
}
