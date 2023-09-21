import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./components/NavBar";
import { Providers } from "./providers";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Primary Meta Tags --> */}
        <title>PocketPR - Simplify the Conversation</title>
        <meta name="title" content="PocketPR - Simplify the Conversation" />
        <meta
          name="description"
          content="Automated public relations assistants for content creators, influencers, businesses, and you! "
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.pocketpr.app/" />
        <meta
          property="og:title"
          content="PocketPR - Simplify the Conversation"
        />
        <meta
          property="og:description"
          content="Automated public relations assistants for content creators, influencers, businesses, and you! "
        />
        <meta property="og:image" content="https://pocketpr.app/meta.png" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.pocketpr.app/" />
        <meta
          property="twitter:title"
          content="PocketPR - Simplify the Conversation"
        />
        <meta
          property="twitter:description"
          content="Automated public relations assistants for content creators, influencers, businesses, and you! "
        />
        <meta
          property="twitter:image"
          content="https://pocketpr.app/meta.png"
        />

        {/* <!-- Meta Tags Generated with https://metatags.io --> */}
      </head>
      <ClerkProvider>
        <body className={publicSans.className}>
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
