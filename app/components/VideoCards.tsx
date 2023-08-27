"use client";
import React, { useState, useEffect } from "react";
import VideoCommentsCaptionsButton from "./VideoCommentsCaptionsButton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

type VideoCardProps = {
  key: number;
  videoId: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
};

export default function VideoCard({
  key,
  title,
  imageUrl,
  videoId,
}: VideoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (title && imageUrl && videoId) {
      setIsLoaded(true);
    }
  }, [title, imageUrl, videoId]);
  // Function to truncate the title if it exceeds 25 characters
  const truncateTitle = (title: string, limit: number = 25) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return (
    <Card className="py-4 bg-green-800">
      <Skeleton isLoaded={isLoaded} className="rounded-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny text-white font-bold">YouTube</p>

          <h4 className="font-bold text-white text-large">
            {truncateTitle(title)}
          </h4>
        </CardHeader>

        <CardBody className="overflow-visible py-2">
          <Image
            alt={title}
            className="object-cover rounded-xl"
            src={imageUrl}
            width={270}
            height={480}
          />
        </CardBody>
      </Skeleton>
    </Card>
  );
}

// <VideoCommentsCaptionsButton videoId={videoId} source={"dashboard"} />
// <Link href={`/dashboard/${videoId}`}>
//        <Button color="primary">{truncateTitle(title)}</Button>
//        </Link>
