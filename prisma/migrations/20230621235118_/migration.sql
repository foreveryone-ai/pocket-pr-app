-- CreateTable
CREATE TABLE "Captions" (
    "id" TEXT NOT NULL,
    "captions" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Captions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Captions_video_id_idx" ON "Captions"("video_id");
