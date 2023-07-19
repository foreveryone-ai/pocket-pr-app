/*
  Warnings:

  - You are about to drop the `Sentiment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sentiment` to the `CommentSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentSummary" ADD COLUMN     "sentiment" "SENTIMENT" NOT NULL;

-- DropTable
DROP TABLE "Sentiment";
