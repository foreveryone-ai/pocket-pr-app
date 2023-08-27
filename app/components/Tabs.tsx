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

export default function Home() {
  return (
    <div className="flex flex-col pb-12">
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
          key="Facebook"
          title={
            <div className="flex items-center space-x-2">
              <BsFacebook />
              <span className="hidden md:inline">Facebook</span>
            </div>
          }
        />
        <Tab
          key="Discord"
          title={
            <div className="flex items-center space-x-2">
              <BiLogoDiscord />
              <span className="hidden md:inline">Discord</span>
            </div>
          }
        />
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
        <Tab
          key="Twitch"
          title={
            <div className="flex items-center space-x-2">
              <BsTwitch />
              <span className="hidden md:inline">Twitch</span>
            </div>
          }
        />
        <Tab
          key="Twitter"
          title={
            <div className="flex items-center space-x-2">
              <BsTwitter />
              <span className="hidden md:inline">Twitter</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
