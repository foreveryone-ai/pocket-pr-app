-- CreateEnum
CREATE TYPE "SENTIMENT" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "google_id" TEXT,
    "twitter_id" TEXT,
    "instagram_id" TEXT,
    "linkedin_id" TEXT,
    "twitch_id" TEXT,
    "discord_id" TEXT,
    "facebook_id" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image_url" TEXT,
    "youtube_channel_id" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_title" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment_id" TEXT NOT NULL,
    "text_display" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,
    "author_display_name" TEXT NOT NULL,
    "author_image_url" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Replies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reply_id" TEXT NOT NULL,
    "text_display" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL,
    "author_display_name" TEXT NOT NULL,
    "author_image_url" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "comment_id" TEXT NOT NULL,
    "summary" TEXT,
    "sentiment" "SENTIMENT",

    CONSTRAINT "Replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Captions" (
    "id" TEXT NOT NULL,
    "captions" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Captions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptionSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summaryText" TEXT NOT NULL,
    "caption_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "CaptionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summaryText" TEXT NOT NULL,
    "sentiment" "SENTIMENT" NOT NULL,
    "comment_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "CommentSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnalysis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentiment_breakdown" TEXT NOT NULL,
    "emotional_analysis" TEXT NOT NULL,
    "conflict_detection" TEXT NOT NULL,
    "conflict_resolution_suggestions" TEXT NOT NULL,
    "popular_topics" TEXT NOT NULL,
    "content_suggestions" TEXT NOT NULL,
    "engagement_opportunities" TEXT NOT NULL,
    "notable_comments" TEXT NOT NULL,
    "influencer_identification" TEXT NOT NULL,
    "tone_of_communication" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "VideoAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_google_id_key" ON "Users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_twitter_id_key" ON "Users"("twitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_instagram_id_key" ON "Users"("instagram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_linkedin_id_key" ON "Users"("linkedin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_twitch_id_key" ON "Users"("twitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_discord_id_key" ON "Users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_facebook_id_key" ON "Users"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Videos_video_id_key" ON "Videos"("video_id");

-- CreateIndex
CREATE INDEX "Videos_user_id_idx" ON "Videos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_video_id_key" ON "Conversation"("video_id");

-- CreateIndex
CREATE INDEX "Conversation_video_id_idx" ON "Conversation"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_sender_id_key" ON "Messages"("sender_id");

-- CreateIndex
CREATE INDEX "Messages_sender_id_idx" ON "Messages"("sender_id");

-- CreateIndex
CREATE INDEX "Messages_conversation_id_idx" ON "Messages"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_comment_id_key" ON "Comments"("comment_id");

-- CreateIndex
CREATE INDEX "Comments_video_id_idx" ON "Comments"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Replies_reply_id_key" ON "Replies"("reply_id");

-- CreateIndex
CREATE INDEX "Replies_comment_id_idx" ON "Replies"("comment_id");

-- CreateIndex
CREATE INDEX "Prompts_user_id_idx" ON "Prompts"("user_id");

-- CreateIndex
CREATE INDEX "Captions_video_id_idx" ON "Captions"("video_id");

-- CreateIndex
CREATE INDEX "CaptionSummary_caption_id_idx" ON "CaptionSummary"("caption_id");

-- CreateIndex
CREATE INDEX "CaptionSummary_video_id_idx" ON "CaptionSummary"("video_id");

-- CreateIndex
CREATE INDEX "CommentSummary_comment_id_idx" ON "CommentSummary"("comment_id");

-- CreateIndex
CREATE INDEX "CommentSummary_video_id_idx" ON "CommentSummary"("video_id");

-- CreateIndex
CREATE INDEX "VideoAnalysis_video_id_idx" ON "VideoAnalysis"("video_id");

-- CreateIndex
CREATE INDEX "VideoAnalysis_user_id_idx" ON "VideoAnalysis"("user_id");
