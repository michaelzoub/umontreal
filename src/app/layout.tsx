import type { Metadata } from "next";
import localFont from "next/font/local";
import { Ubuntu_Mono } from 'next/font/google';
import "./globals.css";

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

const notoSans = Ubuntu_Mono({
  subsets: ['latin'],  // Customize as needed
  weight: ['400', '700'],  // Select weights as needed (e.g., regular and bold)
});

export const metadata: Metadata = {
  title: "uMontreal",
  description: "Montreal's destination for college/university events and parties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={notoSans.className}
      >
        {children}
      </body>
    </html>
  );
}
