import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationMenuDemo } from "./components/Navbar";
import { Toaster } from "sonner";
import TopLoader from "./components/TopLoader";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FastFit Gym",
  description: "FastFit Gym",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;700&family=Prompt:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <TopLoader />
          <NavigationMenuDemo />
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
