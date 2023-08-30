/*
  Warnings:

  - You are about to drop the column `sentiment` on the `Replies` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Videos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'HOBBYIST', 'CONTENT_CREATOR', 'INFLUENCER');

-- DropForeignKey
ALTER TABLE "CaptionSummary" DROP CONSTRAINT "CaptionSummary_video_id_fkey";

-- DropForeignKey
ALTER TABLE "Captions" DROP CONSTRAINT "Captions_video_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_video_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_video_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompts" DROP CONSTRAINT "Prompts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_user_id_fkey";

-- AlterTable
ALTER TABLE "Replies" DROP COLUMN "sentiment";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "Videos";

-- DropEnum
DROP TYPE "SENTIMENT";

-- CreateTable
CREATE TABLE "User" (
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
    "subscriptionStatus" "SubscriptionStatus" NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
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
    "hasEmbeddings" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitter_id_key" ON "User"("twitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_instagram_id_key" ON "User"("instagram_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedin_id_key" ON "User"("linkedin_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitch_id_key" ON "User"("twitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebook_id_key" ON "User"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Video_video_id_key" ON "Video"("video_id");

-- CreateIndex
CREATE INDEX "Video_user_id_idx" ON "Video"("user_id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompts" ADD CONSTRAINT "Prompts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Captions" ADD CONSTRAINT "Captions_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptionSummary" ADD CONSTRAINT "CaptionSummary_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
