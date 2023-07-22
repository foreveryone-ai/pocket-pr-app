import { CommentSummary, SENTIMENT } from "@prisma/client";
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
export async function createUser(
  authToken: string,
  userId: string,
  googleId: string,
  name: string,
  email: string,
  imageUrl: string
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
  youtube_channel_id: string
) {
  try {
    // auth token is here ...
    const db = createServerDbClient(authToken);

    const updatedUser = await db
      .from("Users")
      .update({
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
//-------------------------------Read------------------------------------//
export async function getAnalysis(authToken: string, video_id: string) {
  const db = createServerDbClient(authToken);
  return await db.from("VideoAnalysis").select().eq(`video_id`, video_id);
}

export async function getCaptionSummary(
  authToken: string,
  caption_id: string,
  video_id?: string
) {
  const db = createServerDbClient(authToken);
  if (video_id) {
    return await db.from("CaptionSummary").select().eq(`video_id`, video_id);
  }
  return await db.from("CaptionSummary").select().eq(`caption_id`, caption_id);
}

export async function getCommentsSentiment(authToken: string, videoId: string) {
  const commentIds = [];
  const sentiment = {
    pos: 0,
    neg: 0,
    neu: 0,
  };

  const db = createServerDbClient(authToken);

  const { data: commentData, error: commentError } = await db
    .from("Comments")
    .select()
    .eq(`video_id`, videoId);
  if (commentData && commentData.length > 0) {
    console.log("adding comment ids to array...");
    for (let comment of commentData) {
      commentIds.push(comment.id);
    }
    console.log("ids added to array: ", commentIds);
    console.log("getting comment summaries...");
    const { data: summaryData, error: summaryError } = await db
      .from("CommentsSummary")
      .select()
      .in("comment_id", commentIds);
    if (summaryData && summaryData.length > 0) {
      console.log("returning summary data...");
      for (let summary of summaryData) {
        if (summary.sentiment === SENTIMENT.POSITIVE) {
          sentiment.pos++;
        } else if (summary.sentiment === SENTIMENT.NEGATIVE) {
          sentiment.neg++;
        } else {
          sentiment.neu++;
        }
      }
      return sentiment;
    } else {
      console.error("error getting summary data", summaryError);
      return;
    }
  } else {
    console.error("error getting comment data", commentError);
    return;
  }
}

//-------------------------------Update------------------------------------//
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

//-------------------------------Delete------------------------------------//

export async function getCommentsSummaries(
  authToken: string,
  commentIdArray: string[],
  video_id?: string
) {
  const db = createServerDbClient(authToken);
  if (video_id) {
    return await db.from("CommentSummary").select().eq("video_id", video_id);
  }
  return await db
    .from("CommentSummary")
    .select()
    .in("comment_id", commentIdArray);
}

export async function getComments(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Comments").select().eq(`video_id`, videoId);
}

export async function getCaptions(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Captions").select().eq(`video_id`, videoId);
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

  return await db.from("Users").select().eq(`id`, user_id);
}

export async function getVideo(authToken: string, videoId: string) {
  const db = createServerDbClient(authToken);
  const { data, error } = await db.from("Videos").select().eq("id", videoId);
  return data ? data : error;
}

export async function getVideos(authToken: string, channel_id: string) {
  const db = createServerDbClient(authToken);

  return await db.from("Videos").select().eq(`channel_id`, channel_id);
}

export type StoreCommentSummaryParams = {
  id: string; // in this case, commentId
  sentiment: string;
  summary: string;
};

export async function storeCommentsSummaries(
  authToken: string,
  commentSummaries: StoreCommentSummaryParams[],
  video_id: string
) {
  const commentSummariesToStore: CommentSummary[] = [];
  for (let summary of commentSummaries) {
    let sentiment;
    if (summary.sentiment.toLocaleLowerCase() === "positive") {
      sentiment = SENTIMENT.POSITIVE;
    } else if (summary.sentiment.toLocaleLowerCase() === "negative") {
      sentiment = SENTIMENT.NEGATIVE;
    } else {
      sentiment = SENTIMENT.NEUTRAL;
    }
    // create format for db insert
    commentSummariesToStore.push({
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      summaryText: summary.summary,
      comment_id: summary.id,
      sentiment: sentiment,
      video_id,
    });
  }
  const db = createServerDbClient(authToken);
  // default values are not being generated by prisma
  const { data, error } = await db
    .from("CommentSummary")
    .insert(commentSummariesToStore)
    .select();

  if (data) {
    console.log("returning data from storeCaptionsSummary");
    return data;
  } else {
    console.error("error on storeCaptionsSummary");
    return error;
  }
}

export async function storeCaptionsSummary(
  authToken: string,
  caption_id: string,
  summaryText: string,
  video_id: string
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
    })
    .select();

  if (data) {
    console.log("returning data from storeCaptionsSummary");
    return data;
  } else {
    console.error("error on storeCaptionsSummary");
    return error;
  }
}

// Stage A Pre-Processing -- Draft 1 -- 2021-07-21

export type Comment = {
  comment_id: string;
  text_display: string;
  like_count: number;
  author_display_name: string;
};

export type SmallComment = Pick<
  Comment,
  "comment_id" | "text_display" | "like_count" | "author_display_name"
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
      ({ comment_id, text_display, like_count, author_display_name }) => ({
        comment_id,
        text_display,
        like_count,
        author_display_name,
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

/*
/ DataAnalyser contains all of the methods that will be used to query the database before 
/ sending the prompts to the LLM.
*/
