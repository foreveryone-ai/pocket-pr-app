/*
  Warnings:

  - The `sentiment` column on the `Comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `author_display_name` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_image_url` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prompts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SENTIMENT" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "author_display_name" TEXT NOT NULL,
ADD COLUMN     "author_image_url" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" "SENTIMENT";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Prompts" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Replies" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Videos" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
