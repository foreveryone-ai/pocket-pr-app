import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./components/NavBar";
import { Providers } from "./providers";

export const metadata = {
  title: "PocketPR",
  description:
    "Automated Public Relations Assistants for Content Creators, Businesses, Influencers, and You. Created by ForEveryone.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <main>
            <Providers>
              <NavBar />
              {children}
            </Providers>
          </main>
        </body>
      </ClerkProvider>
    </html>
  );
}
