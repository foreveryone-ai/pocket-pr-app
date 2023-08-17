import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./components/NavBar";
import { Providers } from "./providers";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "PocketPR",
  description: "Created by ForEveryone.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={publicSans.className}>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
