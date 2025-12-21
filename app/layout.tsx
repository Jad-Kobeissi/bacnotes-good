import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "./contexts/UserContext";

export const metadata: Metadata = {
  title: "Bacnotes",
  description: "The best website for BAC students to share and find notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <body className={`antialiased`}>{children}</body>
      </UserContextProvider>
    </html>
  );
}
