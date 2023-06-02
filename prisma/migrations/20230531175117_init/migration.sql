/*
  Warnings:

  - A unique constraint covering the columns `[twitter_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagram_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedin_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitch_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebook_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "discord_id" TEXT,
ADD COLUMN     "facebook_id" TEXT,
ADD COLUMN     "instagram_id" TEXT,
ADD COLUMN     "linkedin_id" TEXT,
ADD COLUMN     "twitch_id" TEXT,
ADD COLUMN     "twitter_id" TEXT;

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
