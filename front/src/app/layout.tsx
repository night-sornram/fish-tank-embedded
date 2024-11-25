import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextUI } from "@/providers/NextUI";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased prose-sm sm:prose-base prose-headings:m-0 prose-p:m-0 prose-ul:m-0  prose-img:m-0 prose-hr:my-5 `}
      >
        <NextUI>{children}</NextUI>
      </body>
    </html>
  );
}
