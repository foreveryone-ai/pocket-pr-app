"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import { Progress } from "@nextui-org/progress";
import { Playfair_Display } from "next/font/google";
import { getOrCreateCaptionSummary, getAllComments } from "@/lib/api";

const playfairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (title && imageUrl && videoId) {
      setIsLoaded(true);
    }
  }, [title, imageUrl, videoId]);

  const handleModalClose = async () => {
    onOpenChange();
    setIsLoading(true);
    // get captions summary
    const summaryRes = await getOrCreateCaptionSummary(videoId);
    console.log("summaryRes", summaryRes);
    // get all comments
    const commentsRes = await getAllComments(videoId);
    console.log("commentsRes", commentsRes);
    // create embeddings
    // check if all was successfull and decrement the users credits
    setIsLoading(false);
    setShowChat(true);
  };

  const handleChatRedirect = () => {
    router.push(`/dashboard/${videoId}`);
  };

  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return (
    <div className="relative">
      <Card className="py-3 bg-green-800">
        <CardHeader className="pb-0 pt-2 px-5 flex justify-between items-start">
          <div>
            <Skeleton isLoaded={isLoaded} className="rounded-md">
              <p className="text-tiny text-red-500 font-md">YouTube</p>
            </Skeleton>
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <h4
                className={`font-bold text-white text-md ${playfairDisplay500.className}`}
              >
                {truncateTitle(title)}
              </h4>
            </Skeleton>
          </div>
          {!showChat ? (
            <Button variant="ghost" className="text-white" onPress={onOpen}>
              Analyze
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-white"
              onPress={handleChatRedirect}
            >
              Chat
            </Button>
          )}
        </CardHeader>

        <CardBody className="overflow-visible py-2 max-h-480">
          <Skeleton isLoaded={isLoaded} className="rounded-large">
            <Image
              alt={title}
              className="object-cover rounded-xl"
              src={imageUrl}
              width={270}
              height={480}
            />
          </Skeleton>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black font-black">
                Confirm Analysis of "{title}"
              </ModalHeader>
              <ModalBody className="">
                <p className="text-black ">
                  If you'd like to analyze this video, click on "Get Started"
                  below.
                </p>
                <p className="text-black ">
                  Once you do, the analysis process will begin. This typically
                  takes a couple of minutes, depending on the number of comments
                  on your video.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Close
                </Button>
                <Button
                  className="bg-green-600 text-white"
                  onPress={handleModalClose}
                >
                  Get Started
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 px-6 rounded-large flex justify-center items-center">
          <Progress
            color="warning"
            isStriped
            size="lg"
            radius="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-sm"
          />
        </div>
      )}
    </div>
  );
}
