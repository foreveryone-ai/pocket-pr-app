import Image from "next/image";
export default function Footer() {
  return (
    <>
      <footer className="p-4 bg-black md:p-8 lg:p-10 ">
        <div className="mx-auto max-w-screen-xl text-center">
          <Image
            src="/gunmetal-logo-full.svg"
            alt="logo"
            height="50"
            width="200"
            className="mx-auto"
          />

          <p className="my-6 text-gray-300">
            Open-source library of over 300+ web components and interactive
            elements built for better web.
          </p>
          <ul className="flex flex-wrap justify-center items-center mb-6 text-white">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Premium
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Campaigns
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Affiliate Program
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Contact
              </a>
            </li>
          </ul>
          <span className="text-sm sm:text-center text-gray-300">
            © 2021-2022{" "}
            <a href="#" className="hover:underline">
              Flowbite™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
