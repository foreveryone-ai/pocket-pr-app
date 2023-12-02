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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Connect YouTube Account</ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={onClose}>Action</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
