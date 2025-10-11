import "./globals.css";
import React from "react";

export const metadata = {
  title: "Brixel",
  description: "Brixel — AI-powered building & trades platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
      <GA4 />
        {children}
      </body>
    </html>
  );
}
