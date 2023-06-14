/*
  Warnings:

  - The `sentiment` column on the `Replies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `author_display_name` to the `Replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_image_url` to the `Replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Replies" ADD COLUMN     "author_display_name" TEXT NOT NULL,
ADD COLUMN     "author_image_url" TEXT NOT NULL,
DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" "SENTIMENT";
