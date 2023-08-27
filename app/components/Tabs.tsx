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
              <span>Facebook</span>
            </div>
          }
        />
        <Tab
          key="Discord"
          title={
            <div className="flex items-center space-x-2">
              <BiLogoDiscord />
              <span>Discord</span>
            </div>
          }
        />
        <Tab
          key="Instagram"
          title={
            <div className="flex items-center space-x-2">
              <AiFillInstagram />
              <span>Instagram</span>
            </div>
          }
        />
        <Tab
          key="YouTube"
          title={
            <div className="flex items-center space-x-2">
              <BsYoutube />
              <span>YouTube</span>
            </div>
          }
        />
        <Tab
          key="LinkedIn"
          title={
            <div className="flex items-center space-x-2">
              <BsLinkedin />
              <span>LinkedIn</span>
            </div>
          }
        />
        <Tab
          key="Twitch"
          title={
            <div className="flex items-center space-x-2">
              <BsTwitch />
              <span>Twitch</span>
            </div>
          }
        />
        <Tab
          key="Twitter"
          title={
            <div className="flex items-center space-x-2">
              <BsTwitter />
              <span>Twitter</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
