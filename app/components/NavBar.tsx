"use client";

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import React from "react";
import { Link } from "@nextui-org/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
      <SignedOut>
        <Navbar
          position="static"
          className="bg-white"
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          <NavbarContent className="sm:hidden pl-8" justify="center">
            <NavbarBrand>
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={100}
                  height={100}
                />
              </Link>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex" justify="center">
            <NavbarBrand className="pr-32">
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={150}
                  height={100}
                />
              </Link>
            </NavbarBrand>
            <NavbarItem className="pl-12">
              <Link color="foreground" href="/dashboard">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/about">
                About
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/contact">
                Contact
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/sign-up">
                <Button variant="bordered">Sign Up</Button>
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/about">
                About
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/pricing">
                Pricing
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/contact">
                Contact
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/sign-in">
                Sign In
              </Link>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </SignedOut>

      <SignedIn>
        <Navbar
          position="static"
          className="bg-white"
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          <NavbarContent className="sm:hidden pl-8" justify="center">
            <NavbarBrand>
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={100}
                  height={100}
                />
              </Link>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex" justify="center">
            <NavbarBrand className="pr-32">
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={150}
                  height={100}
                />
              </Link>
            </NavbarBrand>
            <NavbarItem className="pl-12">
              <Link color="foreground" href="/dashboard">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/reports">
                Past Reports
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/help">
                Get Help
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="lg:flex">
              <UserButton />
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/about">
                About
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/pricing">
                Pricing
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/contact">
                Contact
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/sign-in">
                Sign In
              </Link>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </SignedIn>
    </>
  );
};

export default NavBar;
