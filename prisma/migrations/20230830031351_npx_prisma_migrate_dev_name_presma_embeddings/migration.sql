/*
  Warnings:

  - You are about to drop the `CommentSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoAnalysis` table. If the table is not empty, all the data it contains will be lost.

*/
CREATE EXTENSION IF NOT EXISTS vector;
-- DropForeignKey
ALTER TABLE "CommentSummary" DROP CONSTRAINT "CommentSummary_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentSummary" DROP CONSTRAINT "CommentSummary_video_id_fkey";

-- DropForeignKey
ALTER TABLE "VideoAnalysis" DROP CONSTRAINT "VideoAnalysis_user_id_fkey";

-- DropForeignKey
ALTER TABLE "VideoAnalysis" DROP CONSTRAINT "VideoAnalysis_video_id_fkey";

-- DropTable
DROP TABLE "CommentSummary";

-- DropTable
DROP TABLE "VideoAnalysis";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "vector" vector,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
