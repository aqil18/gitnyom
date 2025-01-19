import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Gothic_A1 } from "next/font/google";
import "./globals.css";

const gothicA1 = Gothic_A1({
  weight: "400",
  variable: "--font-gothic-a1",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GIT NYOM",
  description: "Nyom your repo to generate snack-sized insights and stories. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gothicA1.variable}antialiased flex flex-col items-center
          min-h-screen bg-[#E6FFF4] text-[#255540]
          px-20 py-20`}
      >
        {children}
      </body>
    </html>
  );
}
