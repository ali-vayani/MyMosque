import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";

const mulishFont = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyMosque",
  description: "Strengthen your connection to your community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={mulishFont.className}
      >
        {children}
      </body>
    </html>
  );
}
