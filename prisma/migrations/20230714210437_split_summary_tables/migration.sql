/*
  Warnings:

  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Summary";

-- CreateTable
CREATE TABLE "CaptionSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summaryText" TEXT NOT NULL,
    "caption_id" TEXT NOT NULL,

    CONSTRAINT "CaptionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summaryText" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "CommentSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaptionSummary_caption_id_idx" ON "CaptionSummary"("caption_id");

-- CreateIndex
CREATE INDEX "CommentSummary_comment_id_idx" ON "CommentSummary"("comment_id");
