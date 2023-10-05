"use client";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { Spacer } from "@nextui-org/spacer";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";
import { FaCcStripe } from "react-icons/fa";

export default function NavBar() {
  const router = useRouter();

  const toDashboard = () => {
    router.push("/Dashboard");
  };

  const toSettings = () => {
    router.push("/settings");
  };

  const toHelp = () => {
    router.push("/help");
  };

  const handleStripe = async () => {
    let res, url;

    try {
      res = await fetch("/api/account");
      url = (await res.json()).url;
      router.replace(url);
    } catch (error) {
      console.error("server error");
    }
  };
  return (
    <>
      <div className="navbar isSticky bg-green-800 p-4">
        {/* ----------------------------NAVBAR START---------------------------- */}
        <div className="navbar-start">
          <SignedIn>
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="flat" className="text-white">
                  Menu
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                // disabledKeys={["settings"]}
              >
                <DropdownItem
                  key="dashboard"
                  onPress={toDashboard}
                  className="text-black"
                  color="default"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onPress={toSettings}
                  className="text-black"
                  color="default"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="help"
                  onPress={toHelp}
                  className="text-black"
                  color="default"
                >
                  Get Help
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SignedIn>
        </div>

        {/* ----------------------------NAVBAR CENTER---------------------------- */}
        <Link href="/">
          <Button className="navbar-center bg-gradient-to-tr from-orange-600 to-yellow-300 text-white shadow-lg">
            <Image
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
            <Button isIconOnly variant="light" onPress={handleStripe}>
              <FaCcStripe size={40} color="white" />
            </Button>
            <div className="px-2" />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-up">
              <Button variant="light" className="hidden md:block text-white">
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
    </>
  );
}
