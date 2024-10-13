import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
//import { Toaster } from '../components/ui/toaster';
import Providers from "@/lib/Provider";
import { Toaster } from "sonner";
//import Navbar from "@/components/shared/Navbar";
import RenderNavbar from "@/components/shared/RenderNavbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JourneyMate",
  description: "This is the frontend application for the Travel Tips & Destination Guides platform, a community-driven website for travel enthusiasts to share experiences, tips, and connect with fellow travelers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <RenderNavbar />
          <main>

            {children}
          </main>

        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
