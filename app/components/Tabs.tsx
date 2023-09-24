"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import {
  BsFacebook,
  BsYoutube,
  BsLinkedin,
  BsTwitch,
  BsTwitter,
} from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";
import { AiFillInstagram } from "react-icons/ai";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

export default function Home() {
  return (
    <>
      <Navbar className="bg-white">
        <NavbarBrand>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">Options</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Action event example"
              onAction={(key) => alert(key)}
            >
              <DropdownItem key="update" className="text-black">
                Update
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarBrand>
        <NavbarContent className="" justify="center">
          <Tabs
            disabledKeys={[
              "Facebook",
              "Discord",
              "Instagram",
              "Twitch",
              "LinkedIn",
              "Twitter",
            ]}
            aria-label="Options"
            color="default"
            variant="solid"
          >
            <Tab
              key="Instagram"
              title={
                <div className="flex items-center space-x-2">
                  <AiFillInstagram />
                  <span className="hidden md:inline">Instagram</span>
                </div>
              }
            />
            <Tab
              key="YouTube"
              title={
                <div className="flex items-center space-x-2">
                  <BsYoutube />
                  <span className="hidden md:inline">YouTube</span>
                </div>
              }
            />
            <Tab
              key="LinkedIn"
              title={
                <div className="flex items-center space-x-2">
                  <BsLinkedin />
                  <span className="hidden md:inline">LinkedIn</span>
                </div>
              }
            />
          </Tabs>
        </NavbarContent>
        <NavbarContent justify="end"></NavbarContent>
      </Navbar>
    </>
  );
}
