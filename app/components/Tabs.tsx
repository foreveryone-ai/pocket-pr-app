"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { BsYoutube, BsLinkedin } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";
import { AiFillInstagram } from "react-icons/ai";
import { Button } from "@nextui-org/button";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/update-youtube", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload(); // Refresh the page when the API request completes
    }
  };

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <Button onClick={handleClick}>
            {isLoading ? <Spinner size="sm" color="success" /> : "Update"}
          </Button>
        </NavbarBrand>
        <NavbarContent justify="center">
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
