-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "google_id" TEXT,
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
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_id" TEXT NOT NULL,
    "text_display" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Replies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reply_id" TEXT NOT NULL,
    "text_display" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "comment_id" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,

    CONSTRAINT "Replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prompt_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Prompts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_google_id_key" ON "Users"("google_id");

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
