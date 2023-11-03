export default function About() {
  return (
    <>
      {/* -----------STEP 1------------ */}
      <div className="px-4 lg:px-0 flex flex-col justify-center align-center max-w-2xl mx-auto bg-black">
        <div className="min-h-screen">
          <div className="pt-32">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-4">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-start pl-8 lg:pl-0 lg:justify-center align-center md:text-5xl font-extrabold gradient-text-dual">
                  More than a chat-bot.
                </h1>
                <p className="px-8 pb-4 text-start lg:text-center font-light text-2xl lg:text-3xl text-gray-300">
                  PocketPR combines the familiar chat interface with a
                  personalized public relations experience. But how?
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen">
          <div className="lg:pt-40">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-4">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-start pl-8 lg:pl-0 lg:justify-center align-center md:text-5xl font-extrabold gradient-text-dual">
                  Beyond listening.
                </h1>
                <p className="px-8 pb-4 text-start lg:text-center font-light text-2xl lg:text-3xl text-gray-300">
                  From your audience&apos;s communications, to the context of
                  your posts; from the latest pop culture trends, to the most
                  urgent news; PocketPR knows all.
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen">
          <div className="lg:pt-40">
            <div className="bg-gradient-to-r rounded-3xl from-blue-400 to-yellow-500 p-4">
              <div className="bg-black rounded-2xl">
                <h1 className="px-6 pb-4 pt-8 text-4xl flex justify-start pl-8 lg:pl-0 lg:justify-center align-center md:text-5xl font-extrabold gradient-text-dual">
                  Cross-platform.
                </h1>
                <p className="px-8 pb-4 text-start lg:text-center font-light text-2xl lg:text-3xl text-gray-300">
                  Today we support YouTube. Soon, we&apos;ll support Instagram,
                  Facebook, and X. Then, it&apos;s up to y&apos;all. Join now to
                  get a say.
                  <div className="py-2" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
