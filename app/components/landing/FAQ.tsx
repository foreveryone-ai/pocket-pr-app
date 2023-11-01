import Link from "next/link";
export default function FAQ() {
  return (
    <>
      <section className="bg-black pt-44 pb-24 min-h-screen">
        <div className="px-12">
          <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-4">
            <div className="bg-black rounded-2xl">
              <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <h2 className="text-center pb-8 text-6xl tracking-tight font-extrabold  text-white">
                  FAQ&apos;s
                </h2>
                <div className="grid pt-8 text-left  md:gap-16  md:grid-cols-2">
                  <div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        How does PocketPR work?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        We collect data from your social media platforms and
                        conglomerate said data into a custom knowledge base for
                        your personal LLM assistant, powered by GPT-4.
                      </p>
                    </div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5  text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Do you train your models on my chat data?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        Message data is anonymized and stored for the purpose of
                        fine-tuning our models. Pro users have the option to
                        opt-out from the settings page.
                      </p>
                    </div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5  text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        I used all my free credits; how can I upgrade?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        Easy! Visit the settings page and click upgrade under
                        the "subscription" tab. After paying, you'll be
                        redirected back to PocketPR to upgrade your account and
                        onboard your comments and replies.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Do you offer creator partnerships?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        We are actively onboarding creator partners. If you have
                        a large following and want to work with us, shoot us a
                        message at <u>business@foreveryone.ai</u>.
                      </p>
                    </div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5  text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        When will PocketPR support other platforms?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        We are currently building support for Instagram, X, and
                        Facebook. Pro users will get priority access to new
                        platforms and features as they are tested and released.
                      </p>
                    </div>
                    <div className="mb-10">
                      <h3 className="flex items-center mb-4 text-2xl font-medium  text-white">
                        <svg
                          className="flex-shrink-0 mr-2 w-5 h-5  text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        How does support work?
                      </h3>
                      <p className="text-gray-300 text-xl">
                        Email us at <u>help@foreveryone.ai</u> or hop in our{" "}
                        <Link
                          href="https://discord.gg/hRZjjCZr87"
                          className="text-blue-500"
                        >
                          <u>Discord server</u>
                        </Link>{" "}
                        to chat directly with our founding team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
