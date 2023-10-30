import NavBar from "@/app/components/NavBar";
import Hero from "@/app/components/landing/Hero";
import About from "@/app/components/landing/About";
import Features from "@/app/components/landing/Features";
import Pricing from "@/app/components/landing/Pricing";
import FAQ from "@/app/components/landing/FAQ";
import Footer from "@/app/components/landing/Footer";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <div className="bg-black min-h-screen">
        <NavBar />
        <Hero />
        <About />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
