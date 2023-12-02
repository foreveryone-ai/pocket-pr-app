"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

interface HomeModalProps {
  children: React.ReactNode;
}

export default function HomeModal({ children }: HomeModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
        variant="flat"
      >
        {children}
      </Button>
      <Modal
        className="bg-gray-800"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Sign Up with YouTube</ModalHeader>
              <ModalBody>
                Connect your YouTube account to PocketPR in order to analyze
                your audience&apos;s reactions.
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button
                  as={Link}
                  href="/sign-up"
                  className="bg-gradient-to-tr from-blue-400 to-yellow-500 shadow-lg text-white text-lg"
                >
                  Connect to{" "}
                  <Image
                    src="/yt_logo_rgb_dark.png"
                    width="100"
                    height="100"
                    alt="youtube logo"
                  />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
