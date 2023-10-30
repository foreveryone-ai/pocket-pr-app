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
} from "@nextui-org/react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Dashboard", "settings", "help"];

  return (
    <>
      {/* -------------------------SIGNED-IN------------------------- */}
      <SignedIn>
        <Navbar
          className="bg-black"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand>
              <Link href="/">
                <Image
                  src="/gunmetal-logo-full.svg"
                  alt="logo"
                  width="150"
                  height="100"
                />
              </Link>
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
          className="bg-black"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand>
              <Link href="/">
                <Image
                  src="/gunmetal-logo-full.svg"
                  alt="logo"
                  width="150"
                  height="100"
                />
              </Link>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {/* <NavbarItem>
              <Link color="foreground" href="#">
                Features
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Customers
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem> */}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/sign-in">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/sign-up" variant="flat">
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
