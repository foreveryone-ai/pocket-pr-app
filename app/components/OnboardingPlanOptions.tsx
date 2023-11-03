"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Options() {
  const router = useRouter();

  const toAgreement = () => {
    router.push("/onboarding/agreement");
  };

  const handleCheckout = async () => {
    console.log("to checkout...");

    try {
      const res = await fetch("/api/checkout");

      const data = await res.json();

      router.replace(data.sessionUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
        <div className="justify-self-center">
          <div className="bg-gradient-to-r max-w-lg rounded-3xl from-blue-400 to-yellow-500 p-4">
            <div className="bg-black rounded-2xl p-6">
              <div>
                <h2 className="text-center text-xl font-extrabold gradient-text-dual">
                  Hobbyist
                </h2>
                <h1 className="text-center text-5xl py-4 ">$0/month</h1>
                <h3 className="font-light text-2xl text-gray-300 py-2">
                  Explore the platform and see the benefits of PocketPR.
                </h3>
                <div className="flex flex-col">
                  <ul>
                    <li className="font-medium text-large text-white py-1">
                      Chat with 4 videos per month
                    </li>
                    <li className="font-medium text-large text-white py-1">
                      Explore the platform
                    </li>
                    <li className="font-medium text-large text-white py-1">
                      Weekly video updates
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col pt-5 pb-3">
                  <Button
                    onPress={toAgreement}
                    className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
                  >
                    Get Hobbyist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-self-center">
          <div className="bg-gradient-to-r max-w-lg rounded-3xl from-yellow-500 to-blue-400 p-4">
            <div className="bg-black rounded-2xl p-6">
              <div>
                <h2 className="text-center text-xl font-extrabold gradient-text-dual-reverse">
                  Creator
                </h2>
                <h1 className="text-center text-5xl py-4 ">$25/month</h1>
                <h3 className="font-light text-2xl text-gray-300 py-2">
                  Take your online presence to the next level with PocketPR Pro.
                </h3>
                <div className="flex flex-col">
                  <ul>
                    <li className="font-medium text-large text-white py-1">
                      Chat with unlimited videos
                    </li>
                    <li className="font-medium text-large text-white py-1">
                      Chat with your channel
                    </li>
                    <li className="font-medium text-large text-white py-1">
                      Daily video updates
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col pt-5 pb-3">
                  <Button
                    onPress={handleCheckout}
                    className="bg-gradient-to-tr from-yellow-500 to-blue-400 text-black shadow-lg text-lg"
                  >
                    Get Pro
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
