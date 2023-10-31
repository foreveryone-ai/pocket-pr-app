import Image from "next/image";
export default function About() {
  return (
    <>
      {/* -----------STEP 1------------ */}

      <section className="bg-black">
        <div className="gap-8 min-h-screen items-center py-8 px-4 mx-auto max-w-screen-lg md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            className="w-1/4"
            src="/step-1.svg"
            alt="dashboard image"
            height="50"
            width="50"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-2xl tracking-tight font-bold text-white">
              Let's create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 font-light md:text-lg text-gray-300">
              Flowbite helps you connect with friends and communities of people
              who share your interests. Connecting with your friends and family
              as well as discovering new ones is easy with features like Groups.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900"
            >
              Get started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      {/* -----------STEP 2------------ */}
      <section className="bg-black">
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-lg md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            className="w-1/4"
            src="/step-2.svg"
            alt="dashboard image"
            height="50"
            width="50"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-2xl tracking-tight font-bold text-white">
              Let's create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 font-light md:text-lg text-gray-300">
              Flowbite helps you connect with friends and communities of people
              who share your interests. Connecting with your friends and family
              as well as discovering new ones is easy with features like Groups.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900"
            >
              Get started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      {/* -----------STEP 3------------ */}
      <section className="bg-black">
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-lg md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            className="w-1/4"
            src="step-3.svg"
            alt="dashboard image"
            height="50"
            width="50"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-2xl tracking-tight font-bold text-white">
              Let's create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 font-light md:text-lg text-gray-300">
              Flowbite helps you connect with friends and communities of people
              who share your interests. Connecting with your friends and family
              as well as discovering new ones is easy with features like Groups.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900"
            >
              Get started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
