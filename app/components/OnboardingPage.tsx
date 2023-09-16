"use client";
import { useRouter } from "next/navigation";
import {
  getCaptionsOnboarding,
  getChannelOnboarding,
  getVideoOnboarding,
} from "@/lib/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";
import { Playfair_Display } from "next/font/google";
import { useState } from "react";

const playFairDisplay500 = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
});
const playFairDisplay650 = Playfair_Display({
  weight: ["600"],
  subsets: ["latin"],
});
const playFairDisplay800 = Playfair_Display({
  weight: ["900"],
  subsets: ["latin"],
});

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [step, setStep] = useState(1);
  const [value, setValue] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const nextStep = async () => {
    setIsLoading(true);
    console.log(step);
    switch (step) {
      case 1:
        {
          await getChannelOnboarding();
        }
        break;
      case 2:
        {
          await getVideoOnboarding();
        }
        break;
      case 3:
        {
          await getCaptionsOnboarding();
        }
        break;
      case 4: {
        console.log("hit case 4");
        router.replace("/Dashboard");
        return;
      }
      default: {
        console.log("hit default case");
        router.replace("/Dashboard");
      }
    }
    setStep((prevStep) => prevStep + 1);
    setValue((prevValue) => prevValue + 33);
    setIsLoading(false);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
    setValue((prevValue) => prevValue - 33);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className={`py-4  text-3xl ${playFairDisplay800.className}`}>
          Welcome! It&apos;s time to get you onboarded.
        </h2>
        <h1 className={`pb-12 text-2xl ${playFairDisplay500.className}`}>
          In just a few clicks, we&apos;ll have you automated in no-time.
        </h1>

        <Button onPress={onOpen}>Start</Button>

        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex text-black flex-col gap-1">
                  Onboarding - Step {step}
                </ModalHeader>
                <ModalBody className="text-black">
                  <Progress
                    aria-label="Progress..."
                    size="md"
                    value={value}
                    color="success"
                    showValueLabel={true}
                    className="max-w-md mb-4"
                  />
                  {step === 1 && (
                    <div>
                      <p>First, let's grab your YouTube Channel ID.</p>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <p>Great! Next, we'll need to import your videos.</p>
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      <p>
                        Wow, nice stuff. One last thing! Can't forget the video
                        transcripts...
                      </p>
                    </div>
                  )}
                  {step === 4 && (
                    <div>
                      <p>Perfect! We're all set. Ready to get started?</p>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>

                  {step < 4 ? (
                    <Button
                      color="primary"
                      onPress={nextStep}
                      isLoading={isLoading}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onPress={() => {
                        console.log("finished button..");
                        onClose();
                        nextStep();
                      }}
                      isLoading={isLoading}
                    >
                      Let's do it!
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
