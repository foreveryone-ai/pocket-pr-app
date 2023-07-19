/*
  Warnings:

  - You are about to drop the column `sentiment` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "sentiment",
DROP COLUMN "summary";

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summaryText" TEXT NOT NULL,
    "caption_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentiment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentiment" "SENTIMENT" NOT NULL,
    "caption_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "Sentiment_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "VideoAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Summary_caption_id_idx" ON "Summary"("caption_id");

-- CreateIndex
CREATE INDEX "Summary_comment_id_idx" ON "Summary"("comment_id");

-- CreateIndex
CREATE INDEX "Sentiment_caption_id_idx" ON "Sentiment"("caption_id");

-- CreateIndex
CREATE INDEX "Sentiment_comment_id_idx" ON "Sentiment"("comment_id");

-- CreateIndex
CREATE INDEX "VideoAnalysis_video_id_idx" ON "VideoAnalysis"("video_id");
