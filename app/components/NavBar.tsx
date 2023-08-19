import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { Spacer } from "@nextui-org/spacer";

export default function () {
  return (
    <div className="navbar bg-white pt-6">
      {/* ----------------------------NAVBAR START---------------------------- */}
      <div className="navbar-start">
        <SignedIn>
          <div className="dropdown">
            <Button color="success" tabIndex={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </Button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Past Reports</a>
              </li>
              <li>
                <a>Get Help</a>
              </li>
            </ul>
          </div>
        </SignedIn>
      </div>

      {/* ----------------------------NAVBAR CENTER---------------------------- */}
      <Link href="/">
        <Button className="navbar-center bg-gradient-to-tr from-orange-600 to-yellow-300 text-white shadow-lg">
          <img
            src="/pocket-pr-text.svg"
            alt="panda logo"
            width={75}
            height={50}
          />
        </Button>
      </Link>

      {/* ----------------------------NAVBAR END---------------------------- */}
      <div className="navbar-end mr-2">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-up">
            <Button variant="light" className="hidden md:block">
              Sign Up
            </Button>
          </Link>
          <Spacer x={1} />
          <Link href="/sign-in">
            <Button color="success" variant="solid">
              Sign In
            </Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
}
