import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BloxEmpire - The Most Trusted Gambling Site",
  description: "Play Roulette, Case Battles on the World's biggest gambling site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
