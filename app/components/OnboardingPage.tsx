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
        setIsRedirecting(true);
        router.replace("/Dashboard");
        return;
      }
      default: {
        console.log("hit default case");
        setIsRedirecting(true);
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

        <Button onPress={onOpen} isLoading={isRedirecting}>
          Start
        </Button>

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
                    <div style={{ overflowY: "auto", maxHeight: "200px" }}>
                      <p>
                        1. Introduction Welcome to PocketPR! This User Agreement
                        ("Agreement") governs your use of the PocketPR
                        application ("App"). By accessing or using the App, you
                        agree to be bound by the terms of this Agreement. If you
                        do not agree with these terms, please do not use the
                        App. 2. User Conduct You agree not to use the App to: a)
                        Engage in or promote any illegal activities. b) Transmit
                        or post any content that is violent, offensive, racist,
                        discriminatory, hateful, or otherwise objectionable. c)
                        Harass, threaten, or defame any person or entity. d)
                        Transmit or post any content that infringes upon the
                        rights of others, including intellectual property
                        rights. e) Engage in any activity that disrupts or
                        interferes with the proper working of the App. 3. Chat
                        Messages a) All chat messages exchanged with the App's
                        chatbot are saved by PocketPR. b) Saved chat messages
                        are used for the purpose of improving and training
                        future models. c) All saved chat messages are anonymized
                        to protect user privacy. Personal identifiers are
                        removed to ensure that individual users cannot be
                        identified from the saved data. 4. Privacy Your privacy
                        is important to us. Please review our Privacy Policy,
                        which is incorporated into this Agreement by reference,
                        to understand how we collect, use, and disclose
                        information. 5. Termination PocketPR reserves the right
                        to terminate or suspend your access to the App without
                        prior notice if you violate any terms of this Agreement
                        or for any other reason at our sole discretion. 6.
                        Disclaimers The App is provided "as is" and without
                        warranties of any kind, either express or implied.
                        PocketPR disclaims all warranties, express or implied,
                        including, but not limited to, implied warranties of
                        merchantability, fitness for a particular purpose, and
                        non-infringement. 7. Limitation of Liability To the
                        fullest extent permitted by applicable law, PocketPR
                        shall not be liable for any indirect, incidental,
                        special, consequential, or punitive damages, or any loss
                        of profits or revenues, whether incurred directly or
                        indirectly, or any loss of data, use, goodwill, or other
                        intangible losses, resulting from your use or inability
                        to use the App. 8. Changes to Agreement PocketPR
                        reserves the right to modify this Agreement at any time.
                        Changes will be effective immediately upon posting. Your
                        continued use of the App after changes are posted
                        constitutes your acceptance of the revised Agreement. 9.
                        Governing Law This Agreement is governed by the laws of
                        the jurisdiction in which PocketPR is based, without
                        regard to its conflict of law provisions. 10. Contact
                        For any questions or concerns regarding this Agreement,
                        please contact us at [contact@pocketpr.com]. By using
                        the PocketPR App, you acknowledge that you have read,
                        understood, and agree to be bound by the terms of this
                        User Agreement.
                      </p>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <p>Great! Next, we&apos;ll need to import your videos.</p>
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      <p>
                        Wow, nice stuff. One last thing! Can&apos;t forget the
                        video transcripts...
                      </p>
                    </div>
                  )}
                  {step === 4 && (
                    <div>
                      <p>Perfect! We&apos;re all set. Ready to get started?</p>
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
                      Let&apos;s do it!
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
