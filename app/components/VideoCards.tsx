"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
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
import {
  getOrCreateCaptionSummary,
  getAllComments,
  getOrCreateEmbeddings,
  decrementCredits,
} from "@/lib/api";

const playfairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});

type VideoCardProps = {
  key: number;
  videoId: string;
  title: string;
  imageUrl: string;
  hasEmbeddings: boolean;
  credits: number;
  subscriptionStatus: boolean;
};

export default function VideoCard({
  key,
  title,
  imageUrl,
  videoId,
  hasEmbeddings,
  credits,
  subscriptionStatus,
}: VideoCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showChat, setShowChat] = useState(hasEmbeddings);
  const router = useRouter();

  useEffect(() => {
    if (title && imageUrl && videoId) {
      setIsLoaded(true);
    }
  }, [title, imageUrl, videoId]);

  const openNoCommentsModal = () => {
    openNoCommentsModalDisclosure();
  };

  const handleModalClose = async () => {
    onOpenChange();
    setIsLoading(true);

    try {
      // get captions summary
      const summaryRes = await getOrCreateCaptionSummary(videoId);
      // get all comments
      const commentsRes = await getAllComments(videoId);
      // create embeddings
      const embeddingsRes = await getOrCreateEmbeddings(videoId);

      // check if all was successful and decrement the users credits
      if (summaryRes && commentsRes && embeddingsRes) {
        try {
          const credits = await decrementCredits();
          if (!credits.error) {
            setShowChat(true);
          }
          console.log(credits);
        } catch (error) {
          console.error("problem with credits");
        }
      } else {
        openNoCommentsModal();
      }
    } catch (error) {
      console.error("Error during API calls", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatRedirect = async () => {
    setIsRedirecting(true);
    router.replace(`/chat/${videoId}`);
    setIsRedirecting(false);
  };

  const truncateTitle = (title: string, limit: number = 20) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  const {
    isOpen: isNoCommentsModalOpen,
    onOpen: openNoCommentsModalDisclosure,
    onOpenChange: toggleNoCommentsModal,
  } = useDisclosure();

  return (
    <div className="relative">
      <Card className="bg-gradient-to-tr rounded-3xl from-yellow-200 to-blue-400 p-3">
        <Card className="pt-3 text-black bg-black shadow-lg text-lg">
          <CardHeader className="pb-0 pt-2 px-5 flex justify-between items-start">
            <div>
              <Skeleton isLoaded={isLoaded} className="rounded-md">
                <Chip className="bg-red-700" size="sm">
                  <p className="text-tiny text-white font-md">YouTube</p>
                </Chip>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <h4 className="font-light pt-2 text-white text-xl">
                  {truncateTitle(title)}
                </h4>
              </Skeleton>
            </div>
          </CardHeader>

          <CardBody className="overflow-visible max-h-480">
            <div className="h-36 w-full flex items-center justify-center">
              <Skeleton isLoaded={isLoaded} className="rounded-large w-full">
                <Image
                  alt={title}
                  className="object-cover pt-2 rounded-xl"
                  src={imageUrl}
                  width={270}
                  height={480}
                />
              </Skeleton>
            </div>
          </CardBody>
          <CardFooter className="flex">
            {!showChat && !subscriptionStatus ? ( // Render the "Analyze" button for non-subscribers when showChat is false
              <Button
                className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg mx-2 mb-2"
                fullWidth
                onPress={onOpen}
              >
                Analyze
              </Button>
            ) : showChat ? ( // Render the "Chat" button for all users when showChat is true
              <Button
                fullWidth
                className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg mx-2 mb-2"
                onPress={handleChatRedirect}
                isLoading={isRedirecting}
              >
                Chat
              </Button>
            ) : (
              <Button
                variant="ghost"
                fullWidth
                className="text-white text-lg mx-2 mb-2"
                isDisabled
              >
                No Comments
              </Button>
            )}
          </CardFooter>
        </Card>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-gray-900">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white font-extrabold text-2xl">
                Confirm Analysis of:
                <span className="text-xl font-light">
                  <i>&quot;{title}&quot;</i>
                </span>
              </ModalHeader>
              <ModalBody className="">
                <p className="font-light text-large text-white ">
                  If you&apos;d like to analyze this video, click on &quot;Get
                  Started&quot; below.
                </p>
                <p className="font-light text-large text-white ">
                  Once you do, the analysis process will begin. This typically
                  takes a couple of minutes, depending on the number of comments
                  on your video.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  className="text-red-500 text-large"
                  onPress={onOpenChange}
                >
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black text-large"
                  onPress={handleModalClose}
                >
                  Get Started
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isNoCommentsModalOpen}
        onOpenChange={toggleNoCommentsModal}
      >
        <ModalContent className="bg-black">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white font-extrabold text-2xl">
                Not Enough Comments
              </ModalHeader>
              <ModalBody className="">
                <p className="text-white text-large font-light">
                  Unfortunately, this video does not have enough comments to
                  perform an analysis. When your video has more comments, click
                  the &quot;Update&quot; button at the top of the dashboard to
                  retrieve your latest feedback.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={toggleNoCommentsModal}
                >
                  Close
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
