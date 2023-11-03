"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Chip,
} from "@nextui-org/react";
import { useState } from "react";
import Image from "next/image";
import "animate.css";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* -------------------------SIGNED-IN------------------------- */}
      <SignedIn>
        <Navbar
          className="bg-black py-1"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />

            <NavbarBrand>
              <Link href="/" className="flex">
                <Image
                  src="/gunmetal-pocket-asset.svg"
                  alt="logo"
                  width="125"
                  height="100"
                  className="px-1 animate__animated animate__backInLeft"
                />
                <Image
                  src="/gunmetal-panda-asset.svg"
                  alt="logo"
                  width="25"
                  height="30"
                  className="pb-2 animate__animated animate__backInLeft"
                  style={{ animationDelay: "0.4s" }}
                />
                <Image
                  src="/gunmetal-pr-asset.svg"
                  alt="logo"
                  width="51"
                  height="48"
                  className="px-1 pb-2 animate__animated animate__backInLeft"
                  style={{ animationDelay: "0.8s" }}
                />
              </Link>
              <Chip
                size="sm"
                className="hidden lg:block font-light text-gray-500 ml-1 mb-1 text-medium"
              >
                v0.0.1
              </Chip>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="/Dashboard">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/settings">
                Settings
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/help">
                Help
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Chip
                size="sm"
                className=" lg:hidden font-light text-gray-500 mb-1"
              >
                Beta
              </Chip>
            </NavbarItem>
            <NavbarItem>
              <UserButton />
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu className="bg-black">
            <NavbarMenuItem>
              <Link href="/Dashboard">Dashboard</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/settings">Settings</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/help">Help</Link>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </SignedIn>
      {/* -------------------------SIGNED-OUT------------------------- */}
      <SignedOut>
        <Navbar
          className="bg-black py-1"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="hidden"
            />
            <NavbarBrand>
              <Link href="/" className="flex">
                <Image
                  src="/gunmetal-pocket-asset.svg"
                  alt="logo"
                  width="125"
                  height="100"
                  className="px-1 animate__animated animate__backInLeft"
                />
                <Image
                  src="/gunmetal-panda-asset.svg"
                  alt="logo"
                  width="25"
                  height="30"
                  className="pb-2 animate__animated animate__backInLeft"
                  style={{ animationDelay: "0.4s" }}
                />
                <Image
                  src="/gunmetal-pr-asset.svg"
                  alt="logo"
                  width="51"
                  height="48"
                  className="px-1 pb-2 animate__animated animate__backInLeft"
                  style={{ animationDelay: "0.8s" }}
                />
              </Link>
              <Chip
                size="sm"
                className="hidden lg:block font-light text-gray-500 ml-1 mb-1 text-medium"
              >
                Beta
              </Chip>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent
            className="hidden sm:flex gap-4"
            justify="center"
          ></NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                href="/sign-in"
                variant="ghost"
                className="text-lg text-white"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
                href="/sign-up"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
          {/* <NavbarMenu className="bg-black">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  className="w-full"
                  href="#"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu> */}
        </Navbar>
      </SignedOut>
    </>
  );
}
