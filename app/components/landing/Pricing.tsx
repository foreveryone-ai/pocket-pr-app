import Link from "next/link";
import { Button } from "@nextui-org/button";
export default function Pricing() {
  return (
    <section className="bg-black min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-5xl tracking-tight font-extrabold text-white">
            A plan that fits your growth
          </h2>
          <p className="pt-2 font-light text-3xl text-gray-300">
            Whether you're just here to explore, or you're ready to grow, we got
            you.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
          <div className="justify-self-center">
            <div className="bg-gradient-to-r max-w-lg rounded-3xl from-blue-400 to-yellow-500 p-2">
              <div className="bg-black rounded-2xl p-6">
                <div>
                  <h2 className="text-center text-3xl lg:text-4xl font-extrabold gradient-text-dual">
                    Hobbyist
                  </h2>
                  <h1 className="text-center text-5xl py-2 ">Free</h1>
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
                      as={Link}
                      href="/sign-up"
                      className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
                    >
                      Get Free
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-self-center">
            <div className="bg-gradient-to-r max-w-lg rounded-3xl from-yellow-500 to-blue-400 p-2">
              <div className="bg-black rounded-2xl p-6">
                <div>
                  <h2 className="text-center text-3xl lg:text-4xl font-extrabold gradient-text-dual-reverse">
                    Creator
                  </h2>
                  <h1 className="text-center text-5xl py-2 ">$25/month</h1>
                  <h3 className="font-light text-2xl text-gray-300 py-2">
                    Take your online presence to the next level with PocketPR
                    Pro.
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
                      as={Link}
                      href="/sign-up"
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
      </div>
    </section>
  );
}
