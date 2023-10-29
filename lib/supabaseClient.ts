import { SubscriptionStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

//------------------------ Create Server Db Client -----------------------------//
function createServerDbClient(accessToken?: string) {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
  return createClient(supabaseUrl as string, supabaseKey as string, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: headers,
    },
  });
}
//----------------------- Create User / Stripe User ----------------------------//
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
//--------------------------- get caption summary ------------------------------//
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
//------------------------------ get stripe id ---------------------------------//
export async function getStripeId(authToken: string, userId: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Stripe").select().eq("user_id", userId);
}
//-------------------------- get latest video date -----------------------------//
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
//----------------------- Update Subscription Status ---------------------------//
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
//-------------------------- Store or Update Video -----------------------------//
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
//--------------------------- Type: StoreOrUpdate ------------------------------//
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
//----------------------------- Store Channel_Id -------------------------------//
export async function storeChannelId(
  authToken: string,
  user_id: string,
  youtube_channel_id: string
) {
  try {
    const db = createServerDbClient(authToken);

    // Store the youtube_channel_id in the Channel table
    const { data: channelData, error: channelError } = await db
      .from("Channel")
      .upsert({
        id: youtube_channel_id,
        user_id: user_id,
      })
      .select();

    if (channelError) {
      console.error("Error storing the channel ID: ", channelError);
      return channelError;
    }

    // Update the youtube_channel_id in the `User` table
    const { data: userData, error: userError } = await db
      .from("User")
      .update({
        youtube_channel_id: youtube_channel_id,
      })
      .eq("id", user_id)
      .select();

    if (userError) {
      console.error(
        "Error updating the user's youtube_channel_id: ",
        userError
      );
      return userError;
    }

    console.log("updated channel: ", channelData);
    console.log("updated usr: ", userData);
    return { channelData, userData };
  } catch (error) {
    console.error(error);
    return 400;
  }
}
//----------------------- update "video has embeddings" ------------------------//
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
//--------------------- TYPE: store all comments parameters --------------------//
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
//----------------------------- store all comments -----------------------------//
export async function storeAllComments(
  authToken: string,
  allComments: StoreAllCommentsParams[]
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Comments")
    .upsert(allComments)
    .select();
  console.log("Storing comments to database:", data, error);

  if (data) {
    return data;
  } else {
    return error;
  }
}
//---------------------- TYPE: store all replies parameters --------------------//
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
//---------------------------- store all replies -------------------------------//
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
//------------------------------- get comments ---------------------------------//
export async function getComments(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  const result = await db.from("Comments").select().eq(`video_id`, videoId);

  console.log("Fetched comments from database:", result); // Add this line

  return result;
}
//----------------------------- UPGRADING METHODS ------------------------------//
//----------------------- Comments-and-Replies Functions -----------------------//
// get all video ids that belong to a user id
export async function getVideoIdsByUserId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Video")
    .select("id")
    .eq(`user_id`, user_id);

  if (error) {
    console.error(error);
    return null;
  }

  return data?.map((video) => video.id);
}
// get ids of videos that have comments stored
export async function getVideoIdsFromComments(authToken: string) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db.from("Comments").select("video_id");

  if (error) {
    console.error(error);
    return null;
  }

  return data?.map((comment) => comment.video_id);
}
// get ids of videos that do not have comments stored
export async function getVideoIdsWithoutComments(
  authToken: string,
  user_id: string
) {
  const userVideoIds = await getVideoIdsByUserId(authToken, user_id);
  const commentVideoIds = await getVideoIdsFromComments(authToken);

  if (!userVideoIds || !commentVideoIds) {
    return null;
  }

  const videoIdsWithoutComments = userVideoIds.filter(
    (videoId) => !commentVideoIds.includes(videoId)
  );

  return videoIdsWithoutComments;
}
//----------------------------- Captions Functions -----------------------------//
// get all video_ids for a user from the Captions table
export async function getCaptionVideoIdsByUserId(
  authToken: string,
  user_id: string
) {
  const db = createServerDbClient(authToken);
  const channel_id = await getChannelIdByUserId(authToken, user_id);

  const { data, error } = await db
    .from("Captions")
    .select("video_id")
    .eq(`channel_id`, channel_id);

  if (error) {
    console.error(error);
    return null;
  }

  return data?.map((caption) => caption.video_id);
}
// get all video_ids that exist in the CaptionSummary table
export async function getCaptionSummaryVideoIdsByUserId(
  authToken: string,
  user_id: string
) {
  const db = createServerDbClient(authToken);
  const channel_id = await getChannelIdByUserId(authToken, user_id);

  const { data, error } = await db
    .from("CaptionSummary")
    .select("video_id")
    .eq(`channel_id`, channel_id);

  if (error) {
    console.error(error);
    return null;
  }

  return data?.map((captionSummary) => captionSummary.video_id);
}
// get all videoIds that exist iin the Captions table but not in the CaptionSummary Table
export async function getVideoIdsWithoutCaptionSummary(
  authToken: string,
  user_id: string
) {
  const captionVideoIds = await getCaptionVideoIdsByUserId(authToken, user_id);
  const captionSummaryVideoIds = await getCaptionSummaryVideoIdsByUserId(
    authToken,
    user_id
  );

  if (!captionVideoIds || !captionSummaryVideoIds) {
    return null;
  }

  const videoIdsWithoutCaptionSummary = captionVideoIds.filter(
    (videoId) => !captionSummaryVideoIds.includes(videoId)
  );

  return videoIdsWithoutCaptionSummary;
}
//------------------------------ Embeddings Function ---------------------------//
// get all comments for a given userId
export async function getAllCommentsByChannelId(
  authToken: string,
  user_id: string
) {
  const db = createServerDbClient(authToken);

  // fetch th channel_id from the `User` table
  const { data: userData, error: userError } = await db
    .from("User")
    .select("channel_id")
    .eq("id", user_id);

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const channel_id = userData[0]?.channel_id;

  if (!channel_id) {
    console.error("No channel_id found for user:", user_id);
    return null;
  }

  // Fetch all comments for the channel_id
  const { data: commentsData, error: commentsError } = await db
    .from("Comments")
    .select("*")
    .eq("channel_id", channel_id);

  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
    return null;
  }

  return commentsData;
}

//---------------------------- gett active subscribers -------------------------//
export async function getActiveSubscribers() {
  const db = createClient(supabaseUrl as string, supabaseKey as string);

  const { data, error } = await db
    .from("Stripe")
    .select("user_id")
    .eq("subscription_active", true);

  if (error) {
    console.error("Error fetching active subscribers:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data.map((item) => item.user_id);
  } else {
    return null;
  }
}

//---------------------------- get inactive subscribers ------------------------//
export async function getInactiveSubscribers() {
  const db = createClient(supabaseUrl as string, supabaseKey as string);

  const { data, error } = await db
    .from("Stripe")
    .select("user_id")
    .eq("subscription_active", false);

  if (error) {
    console.error("Error fetching inactive subscribers:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data.map((item) => item.user_id);
  } else {
    return null;
  }
}

//------------------------------- AUTH TOKEN METHODS ---------------------------//
// store user's token
export async function storeUserToken(authToken: string, userId: string) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("User")
    .update({ authToken })
    .eq("id", userId);

  if (error) {
    console.error("Error storing user token:", error);
    return null;
  }

  return data;
}
// get user's token
export async function getUserToken(userId: string) {
  const db = createServerDbClient();

  const { data, error } = await db
    .from("User")
    .select("authToken")
    .eq("id", userId);

  if (error) {
    console.error("error fetching user token:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].authToken;
  } else {
    return null;
  }
}

//------------------------ get all captions from a channel_id ------------------//
export async function getCaptions(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  return await db
    .from("Captions")
    .select("*, channel_id")
    .eq(`video_id`, videoId);
}

//---------------------------- TYPE: comments response -------------------------//
type CommentsResponse = Awaited<ReturnType<typeof getComments>>;
export type CommentsResponseSuccess = CommentsResponse["data"];
export type CommentsResponseError = CommentsResponse["error"];

//-------------------------- TYPE: store captions parameters -------------------//
export type StoreCaptionsParams = {
  id: string;
  video_id: string;
  captions: string;
  updatedAt: Date;
  language: string;
  channel_id: string;
};

//---------------------------------- store captions ----------------------------//
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

//--------------------------------- get channel id -----------------------------//
export async function getChannelId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("User").select().eq(`id`, user_id);
}
//-------------------------------- get video by id -----------------------------//
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

//----------------------------- get videos by channel id -----------------------//
export async function getVideos(authToken: string, channel_id: string) {
  const db = createServerDbClient(authToken);

  return await db
    .from("Video")
    .select()
    .eq(`channel_id`, channel_id)
    .order("published_at", { ascending: false });
}

//---------------------------- get user subscription status---------------------//
export async function getUserSubscriptionStatus(
  authToken: string,
  userId: string
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("Stripe")
    .select("subscription_active")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user subscription status:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].subscription_active;
  } else {
    return null;
  }
}

//------------------------------ get videos by user id--------------------------//
export async function getVideosByUserId(authToken: string, user_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Video").select().eq(`user_id`, user_id);
}

//------------------------ TYPE: store comment summary parameters---------------//
export type StoreCommentSummaryParams = {
  id: string;
  sentiment: string;
  summary: string;
};

//------------------------------- store caption summary ------------------------//
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

//-------------------------------- get caption summaries------------------------//
export async function getCaptionSummaries(
  authToken: string,
  channel_id: string
) {
  const db = createServerDbClient(authToken);

  return await db.from("CaptionSummary").select().eq(`channel_id`, channel_id);
}

//----------------------------- ALL CAPTION SUMMARY METHODS --------------------//
// store all caption summary
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
        body: allCaptionsSummary,
        created_at: new Date(), // Set updated_at to the current date and time
      })
      .select();

    console.log("updated summary: ", updatedSummary);
    return updatedSummary.status; // 201
  } catch (error) {
    console.error(error);
    return 400;
  }
}
// get all caption summary
export async function getAllCaptionSummary(
  authToken: string,
  channel_id: string
): Promise<{ data: any; error: any }> {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("AllCaptionSummary")
    .select("body, created_at") // Add created_at here
    .eq("channel_id", channel_id);

  if (data) {
    return { data, error: null };
  } else {
    console.error("Error retrieving AllCaptionSummary:", error);
    return { data: null, error };
  }
}
// get most recent caption summary
export async function getMostRecentCaptionSummary(
  authToken: string,
  channel_id: string
) {
  const db = createServerDbClient(authToken);

  const { data, error } = await db
    .from("CaptionSummary")
    .select("createdAt")
    .eq("channel_id", channel_id)
    .order("createdAt", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching most recent CaptionSummary:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

//----------------------------- get channel id by user id -----------------------//
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

//------------------------------------- TYPE: comment----------------------------//
export type Comment = {
  comment_id: string;
  text_display: string;
  like_count: number;
  author_display_name: string;
  channel_id: string;
  video_id: string;
};

//--------------------------------- TYPE: SmallComment --------------------------//
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
//---------------------------------- Get 'Agreed' Bool -------------------------//
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
//-------------------------------- Update 'Agreed' Bool ------------------------//
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
//----------------------------- get channel id by video id ---------------------//
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
