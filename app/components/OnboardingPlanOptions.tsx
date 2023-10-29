"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <div className="flex flex-col justify-between p-6 from-gray-100 via-gray-300 to-gray-500 rounded-3xl shadow-2xl bg-gradient-radial">
          <div>
            <h3 className="text-3xl font-bold text-black mb-4">Free</h3>
            <p className="text-lg text-black font-bold pb-3 md:pb-4">
              $0 / month
            </p>
            <ul className="md:pt-2 space-y-2 text-black">
              <li>Chat with 4 videos per month</li>
              <li>Auto-sync refreshes your dashboard once per week</li>
            </ul>
          </div>
          <div className="py-2" />
          <Button
            onPress={toAgreement}
            className="bg-gray-700 text-white rounded-2xl"
          >
            Get Free
          </Button>
        </div>
        <div className="flex flex-col justify-between p-6 from-yellow-300 via-yellow-500 to-yellow-700 rounded-3xl shadow-2xl bg-gradient-radial ">
          <div>
            <h3 className="text-3xl font-bold text-black mb-4">Pro</h3>
            <p className="text-lg text-black font-bold pb-3">$29 / month</p>
            <ul className="space-y-2 text-black">
              <li>Chat with unlimited videos</li>
              <li>Chat with your channel</li>
              <li>Auto-sync refreshes your dashboard nightly</li>
            </ul>
          </div>
          <div className="py-2" />
          <Button
            onPress={handleCheckout}
            className="bg-black text-white rounded-2xl"
          >
            Get Pro
          </Button>
        </div>
      </div>
    </>
  );
}
