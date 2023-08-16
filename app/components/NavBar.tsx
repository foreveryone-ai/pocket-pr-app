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
  const menuItemsSignedIn = ["Dashboard", "Past Reports", "Get Help"];

  const menuItemsSignedOut = ["About", "Contact", "Pricing", "Sign-In"];

  return (
    <>
      <SignedOut>
        <Navbar disableAnimation isBordered>
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarContent className="sm:hidden pl-8" justify="center">
            <NavbarBrand>
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={100}
                  height={70}
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
                  height={70}
                />
              </Link>
            </NavbarBrand>
            <NavbarItem className="pl-12">
              <Link color="foreground" href="/dashboard">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
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
              <Button href="/sign-in" variant="light">
                Sign In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} href="/sign-up">
                Sign Up
              </Button>
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
            {/* {menuItemsSignedOut.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  color="foreground"
                  href="#"
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))} */}
          </NavbarMenu>
        </Navbar>
      </SignedOut>

      <SignedIn>
        <Navbar disableAnimation isBordered>
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarContent className="sm:hidden pl-8" justify="center">
            <NavbarBrand>
              <Link href="/" className="btn btn-ghost normal-case text-2xl">
                <Image
                  src="/pocket-pr-logo.png"
                  alt="panda logo"
                  width={100}
                  height={70}
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
                  height={70}
                />
              </Link>
            </NavbarBrand>
            <NavbarItem className="pl-12">
              <Link color="foreground" href="#">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link color="foreground" href="#">
                Past Reports
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Get Help
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="lg:flex">
              <UserButton />
            </NavbarItem>
            {/* <NavbarItem>
              <Button as={Link} color="warning" href="#" variant="flat">
                Sign Up
              </Button>
            </NavbarItem> */}
          </NavbarContent>

          <NavbarMenu>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/dashboard">
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/reports">
                Past Reports
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/help">
                Get Help
              </Link>
            </NavbarMenuItem>
            {/* {menuItemsSignedIn.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  color="foreground"
                  href="#"
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))} */}
          </NavbarMenu>
        </Navbar>
      </SignedIn>
    </>
  );

  // return (
  //   <div className="navbar bg-white">
  //     <div className="navbar-start">
  //       <SignedOut>
  //         <div className="dropdown">
  //           <label tabIndex={0} className="btn btn-circle">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               className="h-5 w-5"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="#000"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M4 6h16M4 12h16M4 18h7"
  //               />
  //             </svg>
  //           </label>
  //           <ul
  //             tabIndex={0}
  //             className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52"
  //           >
  //             <li>
  //               <Link href="/dashboard">Dashboard</Link>
  //             </li>
  //             <li>
  //               <a>About</a>
  //             </li>
  //             <li>
  //               <a>Contact</a>
  //             </li>
  //           </ul>
  //         </div>
  //       </SignedOut>
  //       <SignedIn>
  //         <div className="dropdown">
  //           <label tabIndex={0} className="btn btn-ghost btn-circle">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               className="h-5 w-5"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="#000"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M4 6h16M4 12h16M4 18h7"
  //               />
  //             </svg>
  //           </label>
  //           <ul
  //             tabIndex={0}
  //             className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52"
  //           >
  //             <li>
  //               <Link href="/dashboard">Dashboard</Link>
  //             </li>
  //             <li>
  //               <Link href="/reports">Past Reports</Link>
  //             </li>
  //             <li>
  //               <Link href="/help">Get Help</Link>
  //             </li>
  //           </ul>
  //         </div>
  //       </SignedIn>
  //     </div>
  //     <div className="navbar-center">
  //       <Link href="/" className="btn btn-ghost normal-case text-2xl">
  //         <Image src="/pocket-pr-logo.png" alt="panda logo" width={150} height={70} />
  //       </Link>
  //     </div>
  //     <div className="navbar-end pr-3">
  //       <SignedIn>
  //         <UserButton />
  //       </SignedIn>
  //       <SignedOut>
  //         <SignInButton />
  //       </SignedOut>
  //     </div>
  //   </div>
  // );
};

export default NavBar;
