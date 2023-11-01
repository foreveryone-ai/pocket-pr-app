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
      //const summaryRes = await getOrCreateCaptionSummary(videoId);
      // get all comments
      //const commentsRes = await getAllComments(videoId);
      // create embeddings
      //const embeddingsRes = await getOrCreateEmbeddings(videoId);
      let summaryRes = true;
      let commentsRes = true;
      let embeddingsRes = true;

      console.log("summaryRes", summaryRes);
      console.log("commentsRes", commentsRes);
      console.log("embeddingsRes", embeddingsRes);

      // check if all was successful and decrement the users credits
      if (summaryRes && summaryRes && embeddingsRes) {
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
      //TODO: show modal saying no chat available because
      //TODO: the video has not captions and/or comments
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

  const truncateTitle = (title: string, limit: number = 10) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  const {
    isOpen: isNoCommentsModalOpen,
    onOpen: openNoCommentsModalDisclosure,
    onOpenChange: toggleNoCommentsModal,
  } = useDisclosure();

  return (
    <div className="relative">
      <Card className="py-3 bg-green-800">
        <CardHeader className="pb-0 pt-2 px-5 flex justify-between items-start">
          <div>
            <Skeleton isLoaded={isLoaded} className="rounded-md">
              <p className="text-tiny text-red-500 font-md">YouTube</p>
            </Skeleton>
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <h4 className="font-playfair font-bold text-white text-md">
                {truncateTitle(title)}
              </h4>
            </Skeleton>
          </div>

          {!showChat && !subscriptionStatus ? ( // Render the "Analyze" button for non-subscribers when showChat is false
            <Button variant="ghost" className="text-white" onPress={onOpen}>
              Analyze
            </Button>
          ) : showChat ? ( // Render the "Chat" button for all users when showChat is true
            <Button
              variant="ghost"
              className="text-white"
              onPress={handleChatRedirect}
              isLoading={isRedirecting}
            >
              Chat
            </Button>
          ) : null}
        </CardHeader>

        <CardBody className="overflow-visible py-2 max-h-480">
          <div className="h-56 w-full flex items-center justify-center">
            <Skeleton isLoaded={isLoaded} className="rounded-large h-56 w-full">
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
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black font-black">
                Confirm Analysis of &quot;{title}&quot;
              </ModalHeader>
              <ModalBody className="">
                <p className="text-black ">
                  If you&apos;d like to analyze this video, click on &quot;Get
                  Started&quot; below.
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

      <Modal
        isOpen={isNoCommentsModalOpen}
        onOpenChange={toggleNoCommentsModal}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black font-black">
                Not Enough Comments
              </ModalHeader>
              <ModalBody className="">
                <p className="text-black ">
                  Unfortunately, this video does not have enough comments to
                  perform an analysis. When your video has more comments, click
                  the &quot;Update&quot; button at the top left of the dashboard
                  to retrieve your latest feedback.
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
