import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Editor Code Online",
  description: "Editor Code Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
