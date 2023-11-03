import "./globals.css";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>PocketPR - Simplify the Conversation</title>
        <meta name="title" content="PocketPR - Turn feedback into fame" />
        <meta
          name="description"
          content="Automated PR assistants for content creators, influencers, businesses, and you! "
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.pocketpr.app/" />
        <meta
          property="og:title"
          content="PocketPR - Simplify the Conversation"
        />
        <meta
          property="og:description"
          content="Automated PR assistants for content creators, influencers, businesses, and you! "
        />
        <meta property="og:image" content="https://pocketpr.app/meta.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.pocketpr.app/" />
        <meta
          property="twitter:title"
          content="PocketPR - Simplify the Conversation"
        />
        <meta
          property="twitter:description"
          content="Automated PR assistants for content creators, influencers, businesses, and you! "
        />
        <meta
          property="twitter:image"
          content="https://pocketpr.app/meta.png"
        />
      </head>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <body>
          <main>
            <Providers>{children}</Providers>
          </main>
        </body>
      </ClerkProvider>
    </html>
  );
}
