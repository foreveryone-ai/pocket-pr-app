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

  const nextStep = async () => {
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
        router.replace("/dashboard");
      }
      default: {
        throw new Error("This should not happen");
      }
    }
    setStep((prevStep) => prevStep + 1);
    setValue((prevValue) => prevValue + 33);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
    setValue((prevValue) => prevValue - 33);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className={`py-4  text-3xl ${playFairDisplay800.className}`}>
          Welcome! It's time to get you onboarded.
        </h2>
        <h1 className={`pb-12 text-2xl ${playFairDisplay500.className}`}>
          In just a few clicks, we'll have you automated in no-time.
        </h1>

        <Button onPress={onOpen}>Start</Button>

        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex text-black flex-col gap-1">
                  Modal Title - Step {step}
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
                      <p>This is the content of step 1.</p>
                      {/* ... other content for step 1 ... */}
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <p>This is the content of step 2.</p>
                      {/* ... other content for step 2 ... */}
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      <p>This is the content of step 3.</p>
                      {/* ... other content for step 3 ... */}
                    </div>
                  )}
                  {step === 4 && (
                    <div>
                      <p>This is the content of step 4.</p>
                      {/* ... other content for step 4 ... */}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>

                  {step < 4 ? (
                    <Button color="primary" onPress={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button color="primary" onPress={onClose}>
                      Finish
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
