import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <>
      <footer className="p-4 bg-black md:p-8 lg:p-10 ">
        <div className="mx-auto py-4 max-w-screen-xl text-center">
          <Image
            src="/gunmetal-logo-full.svg"
            alt="logo"
            height="50"
            width="200"
            className="mx-auto"
          />

          <p className="mt-6 text-gray-300 text-2xl">
            Automated PR assistants for content creators, influencers, and
            businesses.
          </p>

          <Link href="/privacy" className=" underline text-gray-500 text-large">
            Check out our Privacy Policy and Google&apos;s Limited Use
            compliance here
          </Link>
          <br />

          <span className="text-sm sm:text-center text-gray-300">
            © 2023{" "}
            <a href="#" className="hover:underline">
              ForEveryone.AI{" "}
            </a>
            - All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
